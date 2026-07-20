import { useState } from "react";
import { login } from "../services/api";

function Login({ setUser, setShowLogin }) {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(accountNumber, pin);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setUser(response.data.user);
    } catch (error) {
      alert("Invalid Account Number or PIN");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
          FinVault
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Secure Digital Banking System
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 mb-6 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => setShowLogin(false)}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;