import { motion, AnimatePresence } from "framer-motion";
import bankingBg from "../assets/bank-img1.png";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  getBalance,
  deposit,
  withdraw,
} from "../services/api";

function Dashboard({
  user,
  setUser,
  onLogout,
}) {
  const [displayBalance, setDisplayBalance] =
  useState(0);

  const [transactionStatus, setTransactionStatus] =
  useState("idle");

const [transactionType, setTransactionType] =
  useState("");

const [transactionAmount, setTransactionAmount] =
  useState(0);
  const [activePage, setActivePage] =
    useState("dashboard");

  const [balance, setBalance] = useState(
    user.balance || 0
  );

  const [amount, setAmount] = useState("");

  const [history, setHistory] = useState([]);

  const [profileImage, setProfileImage] =
  useState(
    localStorage.getItem("profileImage") || ""
  );

  const [totalDeposit, setTotalDeposit] =
    useState(0);

  const [totalWithdraw, setTotalWithdraw] =
    useState(0);
      const handleProfileImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

reader.onloadend = () => {
  const imageData = reader.result;

  setProfileImage(imageData);

  localStorage.setItem(
    "profileImage",
    imageData
  );
};
 reader.readAsDataURL(file);
};

  const fetchBalance = async () => {
    try {
      const response = await getBalance(
        user.accountNumber
      );

      setBalance(response.data.balance);

      setUser({
        ...user,
        balance: response.data.balance,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeposit = async () => {
  if (!amount || Number(amount) <= 0)
    return;

  setTransactionType("Deposit");
  setTransactionAmount(Number(amount));
  setTransactionStatus("processing");

  try {
    const response = await deposit(
      user.accountNumber,
      Number(amount)
    );

    setTimeout(() => {
      setTransactionStatus("success");
    }, 1500);

    setBalance(response.data.balance);

    setUser({
      ...user,
      balance: response.data.balance,
    });

    setTotalDeposit(
      (prev) => prev + Number(amount)
    );

    setHistory((prev) => [
      {
        type: "Deposit",
        amount: Number(amount),
      },
      ...prev,
    ]);

    setAmount("");
  } catch (err) {
    setTransactionStatus("idle");
    alert("Deposit Failed");
  }
};

  const handleWithdraw = async () => {
  if (!amount || Number(amount) <= 0)
    return;

  setTransactionType("Withdraw");
  setTransactionAmount(Number(amount));
  setTransactionStatus("processing");

  try {
    const response = await withdraw(
      user.accountNumber,
      Number(amount)
    );

    setTimeout(() => {
      setTransactionStatus("success");
    }, 1500);

    setBalance(response.data.balance);

    setUser({
      ...user,
      balance: response.data.balance,
    });

    setTotalWithdraw(
      (prev) => prev + Number(amount)
    );

    setHistory((prev) => [
      {
        type: "Withdraw",
        amount: Number(amount),
      },
      ...prev,
    ]);

    setAmount("");
  } catch (err) {
    setTransactionStatus("idle");
    alert("Insufficient Balance");
  }
};

  useEffect(() => {
    fetchBalance();
  }, []);
  useEffect(() => {
  let start = 0;

  const end = balance;

  if (start === end) return;

  const duration = 1000;

  const increment =
    end / (duration / 16);

  const timer = setInterval(() => {
    start += increment;

    if (start >= end) {
      start = end;
      clearInterval(timer);
    }

    setDisplayBalance(
      Math.floor(start)
    );
  }, 16);

  return () => clearInterval(timer);
}, [balance]);

  const renderContent = () => {
    switch (activePage) {
     case "balance":
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8"
    >
      {/* Floating Icons */}

      <div className="absolute top-10 right-16 text-6xl opacity-10 animate-bounce">
        ₹
      </div>

      <div className="absolute bottom-12 left-12 text-5xl opacity-10 animate-pulse">
        💰
      </div>

      <div className="absolute top-1/2 right-1/3 text-5xl opacity-10 animate-bounce">
        💳
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Account Balance
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-center">

        {/* Balance Card */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.4)]"
        >
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>

          <div className="relative z-10">

            <p className="text-white/80 text-lg">
              Available Balance
            </p>

            <h2 className="text-6xl font-bold mt-4">
              ₹{displayBalance}
            </h2>

            <p className="mt-4 text-white/80">
              Secure • Protected
            </p>

          </div>
        </motion.div>

        {/* Progress Ring */}

        <div className="flex justify-center">

          <div className="relative w-64 h-64">

            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="15"
                fill="none"
              />

              <motion.circle
                cx="100"
                cy="100"
                r="80"
                stroke="#22d3ee"
                strokeWidth="15"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="502"
                initial={{
                  strokeDashoffset: 502,
                }}
                animate={{
                  strokeDashoffset: 100,
                }}
                transition={{
                  duration: 1.5,
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <h2 className="text-5xl font-bold text-cyan-400">
                80%
              </h2>

              <p className="text-gray-300 mt-2">
                Account Health
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Extra Info */}

      <div className="mt-10 grid md:grid-cols-3 gap-6">

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          className="bg-green-500/10 border border-green-400/20 rounded-2xl p-6"
        >
          <p>Total Deposits</p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            ₹{totalDeposit}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          className="bg-red-500/10 border border-red-400/20 rounded-2xl p-6"
        >
          <p>Total Withdrawals</p>

          <h2 className="text-3xl font-bold text-red-400 mt-2">
            ₹{totalWithdraw}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-6"
        >
          <p>Status</p>

          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            Active
          </h2>
        </motion.div>

      </div>
    </motion.div>
  );

      case "transactions":
        return (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <h1 className="text-3xl font-bold mb-6">
              Transactions
            </h1>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Enter Amount"
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 mb-4"
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDeposit}
                className="bg-green-500 hover:bg-green-600 py-4 rounded-xl"
              >
                Deposit
              </button>

              <button
                onClick={handleWithdraw}
                className="bg-red-500 hover:bg-red-600 py-4 rounded-xl"
              >
                Withdraw
              </button>
            </div>
            <AnimatePresence>
  {transactionStatus === "processing" && (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-8 bg-yellow-500/10 border border-yellow-400/30 rounded-3xl p-6"
    >
      <div className="flex flex-col items-center">

        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

        <h2 className="text-2xl font-bold mt-4">
          Processing Transaction...
        </h2>

        <p className="text-gray-300 mt-2">
          Please wait while we complete
          your transaction.
        </p>

      </div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {transactionStatus === "success" && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="mt-8 bg-green-500/10 border border-green-400/30 rounded-3xl p-8"
    >
      <div className="text-center">

        <div className="text-7xl animate-bounce">
          ✅
        </div>

        <h2 className="text-3xl font-bold text-green-400 mt-4">
          {transactionType} Successful
        </h2>

        <p className="text-5xl font-bold mt-4">
          ₹{transactionAmount}
        </p>

        <p className="text-gray-300 mt-3">
          Your account has been updated.
        </p>

        <button
          onClick={() =>
            setTransactionStatus("idle")
          }
          className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
        >
          Done
        </button>

      </div>
    </motion.div>
  )}
</AnimatePresence>
          </div>
        );

      case "history":
        return (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <h1 className="text-3xl font-bold mb-6">
              Transaction History
            </h1>

            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3">
                    Type
                  </th>

                  <th className="text-left py-3">
                    Amount
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3">
                      {item.type}
                    </td>

                    <td>₹{item.amount}</td>

                    <td className="text-green-400">
                      Success
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "profile":
  return (
    <div className="space-y-8">

      {/* Profile Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 overflow-hidden">

        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full animate-pulse"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">

          {/* Profile Image */}

          <div className="relative">

            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.4)]">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-6xl font-bold">
  {user?.name?.charAt(0)?.toUpperCase()}
</div>
              )}

            </div>

            {/* Edit Button */}

            <label className="absolute bottom-2 right-2 bg-cyan-500 hover:bg-cyan-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110">

              ✏️

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImage}
              />

            </label>

          </div>

          {/* User Info */}

          <div>

            <h1 className="text-4xl font-bold">
              {user.name}
            </h1>

            <p className="text-gray-300 mt-2">
              Premium Banking User
            </p>

            <div className="mt-6 space-y-3">

              <p>
                <span className="font-semibold">
                  Account Number:
                </span>{" "}
                {user.accountNumber}
              </p>

              <p>
                <span className="font-semibold">
                  Current Balance:
                </span>{" "}
                <span className="text-cyan-400">
                  ₹{balance}
                </span>
              </p>

              <p className="flex items-center gap-2">

                <span className="relative flex h-4 w-4">

                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>

                </span>

                <span className="text-green-400 font-bold">
                  Active
                </span>

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="backdrop-blur-xl bg-green-500/10 border border-green-400/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500">

          <p>Total Deposits</p>

          <h1 className="text-5xl font-bold text-green-400 mt-3">
            ₹{totalDeposit}
          </h1>

        </div>

        <div className="backdrop-blur-xl bg-red-500/10 border border-red-400/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500">

          <p>Total Withdrawals</p>

          <h1 className="text-5xl font-bold text-red-400 mt-3">
            ₹{totalWithdraw}
          </h1>

        </div>

      </div>

    </div>
  );

      case "settings":
        return (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <h1 className="text-3xl font-bold mb-6">
              Settings
            </h1>

            <p className="text-gray-300">
              Settings page coming soon...
            </p>
          </div>
        );

      default:
        return (
          <>
          <div className="mb-8">
          <img
          src={bankingBg}
          alt="Secure Banking"
            className="w-full max-h-[300px] object-cover rounded-3xl border border-white/20"
            />
          </div>
            <h1 className="text-4xl font-bold mb-8">
              Welcome, {user.name}
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:border-cyan-400/50 cursor-pointer">
                <p className="text-gray-300 flex items-center gap-2">
                 💰 Current Balance
                </p>

                <h2 className="text-4xl font-bold text-cyan-400 mt-2">
                  ₹{balance}
                </h2>
              </div>

              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] hover:border-indigo-400/50 cursor-pointer">
               <p className="text-gray-300 flex items-center gap-2">
                 🔐 Account Number
                </p>

                <h2 className="text-xl font-bold mt-2">
                  {user.accountNumber}
                </h2>
              </div>

              <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_35px_rgba(34,197,94,0.4)] hover:border-green-400/50 cursor-pointer">
                <p className="text-gray-300">
                  Status
                </p>

                <div className="flex items-center gap-3 mt-2">
  <span className="relative flex h-4 w-4">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
  </span>

  <h2 className="text-2xl font-bold text-green-400">
    Active
  </h2>
</div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-white/20 rounded-3xl p-8">

  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>

  <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/10 rounded-full blur-2xl animate-pulse"></div>

  <div className="relative z-10">

    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
      📊 Banking Summary
    </h2>

    <div className="space-y-5">

      <div className="group bg-white/10 hover:bg-white/20 transition-all duration-500 p-5 rounded-2xl border border-green-500/20 hover:border-green-400/50 hover:scale-105">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-300">
              Total Deposits
            </p>

            <h2 className="text-green-400 text-4xl font-bold mt-2">
              ₹{totalDeposit}
            </h2>
          </div>

          <div className="text-5xl group-hover:scale-125 transition-all duration-500">
            📈
          </div>

        </div>

      </div>

      <div className="group bg-white/10 hover:bg-white/20 transition-all duration-500 p-5 rounded-2xl border border-red-500/20 hover:border-red-400/50 hover:scale-105">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-300">
              Total Withdrawals
            </p>

            <h2 className="text-red-400 text-4xl font-bold mt-2">
              ₹{totalWithdraw}
            </h2>
          </div>

          <div className="text-5xl group-hover:scale-125 transition-all duration-500">
            📉
          </div>

        </div>

      </div>

    </div>

  </div>

</div>

              <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-white/20 rounded-3xl p-8">

  {/* Animated Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse"></div>

  {/* Floating Circles */}
  <div className="absolute top-8 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>

  <div className="absolute bottom-8 right-10 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>

  <div className="relative z-10">
    <h2 className="text-2xl font-bold mb-6">
      Recent Activity
    </h2>

    {history.length === 0 ? (
      <div className="flex flex-col items-center justify-center text-center py-10">

        {/* Floating Bank Icon */}
        <div className="text-7xl animate-bounce mb-6">
          🏦
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>

            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </div>

          <span className="text-green-400 font-semibold">
            Waiting for new transactions...
          </span>
        </div>

        <p className="text-gray-300 max-w-xs">
          Your recent banking activities
          will automatically appear here
          once you make a deposit or withdrawal.
        </p>
      </div>
    ) : (
      <div className="space-y-4 max-h-72 overflow-y-auto">
        {history.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  item.type === "Deposit"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              />

              <div>
                <p className="font-semibold">
                  {item.type}
                </p>

                <p className="text-sm text-gray-400">
                  Successful Transaction
                </p>
              </div>
            </div>

            <span
              className={`font-bold text-lg ${
                item.type === "Deposit"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {item.type === "Deposit"
                ? "+"
                : "-"}
              ₹{item.amount}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
        user={user}
        profileImage={profileImage}
      />

      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;