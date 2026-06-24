import { useState } from "react";
import { signup } from "../services/api";

function Signup({ setShowLogin }) {
  const [form, setForm] = useState({
    name: "",
    accountNumber: "",
    pin: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      await signup(form);

      alert("Account Created Successfully");
      setShowLogin(true);
    } catch (error) {
      alert("Error Creating Account");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 flex items-center justify-center px-4 overflow-hidden relative">
      
      {/* Background Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-300 mb-8">
  Create Your Secure Banking Account
        </p>
        <input
          type="text"
          placeholder="Full Name"
          name="name"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="text"
          placeholder="Account Number"
          name="accountNumber"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="password"
          placeholder="PIN"
          name="pin"
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300"
        >
          Create Account
        </button>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => setShowLogin(true)}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Signup;