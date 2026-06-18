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

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          FinVault
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Digital Banking System
        </p>
      </div>

      <div className="space-y-3">

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300
              ${
                activePage === item.id
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "hover:bg-white/10"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

      </div>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 p-4 rounded-xl transition"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </aside>
  );
}