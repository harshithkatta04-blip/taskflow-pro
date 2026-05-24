import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import API from "./api";
import Login from "./Login";
import Register from "./Register";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [mode, setMode] = useState("login");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTasks = () => {
    API.get("/api/tasks", authHeaders).then((res) => setTasks(res.data));
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // ADD TASK
  const addTask = () => {
    if (!title) return;

    API.post(
      "/api/tasks",
      { title, priority, dueDate },
      authHeaders
    ).then(() => {
      toast.success("Task created 🚀");
      setTitle("");
      setPriority("medium");
      setDueDate("");
      fetchTasks();
    });
  };

  // UPDATE STATUS
  const updateStatus = (id, status) => {
    API.put(`/api/tasks/${id}`, { status }, authHeaders).then(() => {
      toast.success(`Moved to ${status.toUpperCase()} ✔️`);
      fetchTasks();
    });
  };

  const deleteTask = (id) => {
    API.delete(`/api/tasks/${id}`, authHeaders).then(() => {
      toast.error("Task deleted 🗑️");
      fetchTasks();
    });
  };

  // DRAG & DROP
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    updateStatus(draggableId, destination.droppableId);
  };

  const grouped = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const priorityColors = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-600",
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "done") return false;
    return new Date(dueDate) < new Date();
  };

  const isToday = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const Column = ({ title, items, color }) => (
    <div
      className="flex-1 bg-white rounded-2xl shadow-lg border-t-4 p-5"
      style={{ borderTopColor: color }}
    >
      <h3 className="text-xl font-bold mb-4">
        {title} ({items.length})
      </h3>

      <Droppable droppableId={title.toLowerCase().replace(" ", "")}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[200px]"
          >
            {items.map((t, index) => {
              const overdue = isOverdue(t.dueDate, t.status);
              const today = isToday(t.dueDate);

              return (
                <Draggable key={t._id} draggableId={t._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`border rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                        overdue ? "bg-red-50 border-red-300" : "bg-gray-50"
                      }`}
                    >
                      {/* TITLE */}
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">
                          {t.title}
                        </p>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${priorityColors[t.priority]}`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      {/* DUE DATE */}
                      {t.dueDate && (
                        <div className="mt-2 text-xs">
                          <span
                            className={`px-2 py-1 rounded ${
                              overdue
                                ? "bg-red-200 text-red-700"
                                : today
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {overdue
                              ? "⚠ Overdue"
                              : today
                              ? "📅 Due Today"
                              : `Due: ${new Date(
                                  t.dueDate
                                ).toLocaleDateString()}`}
                          </span>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="flex justify-between items-center mt-4">
                        <select
                          value={t.status}
                          onChange={(e) =>
                            updateStatus(t._id, e.target.value)
                          }
                          className="text-sm border rounded-lg px-2 py-1"
                        >
                          <option value="todo">Todo</option>
                          <option value="inprogress">In Progress</option>
                          <option value="done">Done</option>
                        </select>

                        <button
                          onClick={() => deleteTask(t._id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}

            {items.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-4">
                No tasks yet
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );

  if (!token) {
    if (mode === "login") return <Login setToken={setToken} setMode={setMode} />;
    if (mode === "register") return <Register setMode={setMode} />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-100 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700">
              TaskFlow Pro
            </h1>
            <p className="text-gray-500 mt-1">
              Organize tasks. Track progress. Boost productivity.
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
            }}
            className="bg-red-500 text-white px-5 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>

        {/* ADD TASK */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task"
            className="border rounded-xl px-4 py-2 w-72"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded-xl px-4 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-xl px-4 py-2"
          />

          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            Add Task
          </button>
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column title="Todo" items={grouped.todo} color="red" />
          <Column title="In Progress" items={grouped.inprogress} color="orange" />
          <Column title="Done" items={grouped.done} color="green" />
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;