import { useState } from "react";
import API from "./api";

export default function Login({ setToken, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid login"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        {/* BRANDING */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-white">
            TaskFlow Pro
          </h1>

          <p className="text-gray-200 mt-2 text-sm">
            Organize tasks. Track progress. Boost productivity.
          </p>

        </div>

        {/* LOGIN TITLE */}
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Welcome Back
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-white text-blue-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition duration-200 shadow-lg"
        >
          Login
        </button>

        {/* OPTIONS */}
        <div className="text-sm text-center mt-6 space-y-3">

          <p
            onClick={() => setMode("register")}
            className="text-white cursor-pointer hover:underline"
          >
            Create a new account
          </p>

          <p
            onClick={() => setMode("forgot")}
            className="text-white cursor-pointer hover:underline"
          >
            Forgot password?
          </p>

        </div>

      </div>
    </div>
  );
}