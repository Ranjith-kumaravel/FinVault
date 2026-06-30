import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(() => {
  const savedUser =
    localStorage.getItem("user");

  return savedUser
    ? JSON.parse(savedUser)
    : null;
});
  const [showLogin, setShowLogin] = useState(true);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};

  if (user) {
    return (
      <Dashboard
        user={user}
        setUser={setUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 flex items-center justify-center px-4">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>

      {/* App Card */}
      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {showLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
            >
              <Login
                setUser={setUser}
                setShowLogin={setShowLogin}
              />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <Signup
                setShowLogin={setShowLogin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;