<<<<<<< HEAD
import {
  FaHome,
  FaWallet,
  FaMoneyBillWave,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({
  activePage,
  setActivePage,
  onLogout,
  user,
  profileImage,
}) {
  
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaHome />,
    },
    {
      id: "balance",
      label: "Balance",
      icon: <FaWallet />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <FaMoneyBillWave />,
    },
    {
      id: "history",
      label: "History",
      icon: <FaHistory />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <FaUser />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="w-72 min-h-screen backdrop-blur-xl bg-white/10 border-r border-white/20 text-white flex flex-col p-6">

      {/* Logo + Profile */}

      <div className="flex flex-col items-center mb-10">

        <div className="relative">

          {/* Glow Effect */}

          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl animate-pulse"></div>

          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="relative w-24 h-24 rounded-full border-4 border-cyan-400 object-cover shadow-[0_0_25px_rgba(34,211,238,0.5)]"
            />
          ) : (
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)]">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {/* Online Dot */}

          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"></div>

        </div>

        <h1 className="text-4xl font-extrabold mt-5 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          FinVault
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Digital Banking System
        </p>

      </div>

      {/* Menu */}

      <div className="space-y-3">

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setActivePage(item.id)
            }
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
            ${
              activePage === item.id
                ? "bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-500/10"
                : "hover:bg-white/10 hover:translate-x-2"
            }`}
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.label}
            </span>
          </button>
        ))}

      </div>

      {/* Logout */}

      <button
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-300 p-4 rounded-2xl font-semibold shadow-lg"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </aside>
  );
=======
import {
  FaHome,
  FaWallet,
  FaMoneyBillWave,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({
  activePage,
  setActivePage,
  onLogout,
  user,
  profileImage,
}) {
  
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaHome />,
    },
    {
      id: "balance",
      label: "Balance",
      icon: <FaWallet />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <FaMoneyBillWave />,
    },
    {
      id: "history",
      label: "History",
      icon: <FaHistory />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <FaUser />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="w-72 min-h-screen backdrop-blur-xl bg-white/10 border-r border-white/20 text-white flex flex-col p-6">

      {/* Logo + Profile */}

      <div className="flex flex-col items-center mb-10">

        <div className="relative">

          {/* Glow Effect */}

          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl animate-pulse"></div>

          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="relative w-24 h-24 rounded-full border-4 border-cyan-400 object-cover shadow-[0_0_25px_rgba(34,211,238,0.5)]"
            />
          ) : (
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)]">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          {/* Online Dot */}

          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900"></div>

        </div>

        <h1 className="text-4xl font-extrabold mt-5 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          FinVault
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Digital Banking System
        </p>

      </div>

      {/* Menu */}

      <div className="space-y-3">

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setActivePage(item.id)
            }
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
            ${
              activePage === item.id
                ? "bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-500/10"
                : "hover:bg-white/10 hover:translate-x-2"
            }`}
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.label}
            </span>
          </button>
        ))}

      </div>

      {/* Logout */}

      <button
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-300 p-4 rounded-2xl font-semibold shadow-lg"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </aside>
  );
>>>>>>> 72013941db107fbe5324f851cececbb36dff5b68
}