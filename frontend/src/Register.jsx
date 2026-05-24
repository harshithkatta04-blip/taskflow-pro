import { useState } from "react";
import API from "./api";

export default function Register({ setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/api/auth/register", {
        email,
        password,
      });

      alert("Registration successful");

      setMode("login");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 p-6">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        {/* BRANDING */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-white">
            TaskFlow Pro
          </h1>

          <p className="text-gray-200 mt-2 text-sm">
            Create your workspace and manage tasks smarter.
          </p>

        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {/* EMAIL */}
        <input
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-200 mb-4 outline-none focus:ring-2 focus:ring-white"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-200 mb-5 outline-none focus:ring-2 focus:ring-white"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* REGISTER BUTTON */}
        <button
          onClick={handleRegister}
          className="w-full bg-white text-purple-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition duration-200 shadow-lg"
        >
          Create Account
        </button>

        {/* LOGIN OPTION */}
        <div className="text-sm text-center mt-6">

          <p
            onClick={() => setMode("login")}
            className="text-white cursor-pointer hover:underline"
          >
            Already have an account? Login
          </p>

        </div>

      </div>
    </div>
  );
}