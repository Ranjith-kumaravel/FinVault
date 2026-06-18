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
  const [activePage, setActivePage] =
    useState("dashboard");

  const [balance, setBalance] = useState(
    user.balance || 0
  );

  const [amount, setAmount] = useState("");

  const [history, setHistory] = useState([]);

  const [totalDeposit, setTotalDeposit] =
    useState(0);

  const [totalWithdraw, setTotalWithdraw] =
    useState(0);

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

    try {
      const response = await deposit(
        user.accountNumber,
        Number(amount)
      );

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
      alert("Deposit Failed");
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0)
      return;

    try {
      const response = await withdraw(
        user.accountNumber,
        Number(amount)
      );

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
      alert("Insufficient Balance");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "balance":
        return (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <h1 className="text-3xl font-bold mb-6">
              Account Balance
            </h1>

            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8">
              <p className="text-white/80">
                Available Balance
              </p>

              <h2 className="text-5xl font-bold mt-3">
                ₹{balance}
              </h2>
            </div>
          </div>
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
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <h1 className="text-3xl font-bold mb-6">
              Profile
            </h1>

            <div className="space-y-4">
              <p>
                <strong>Name:</strong>{" "}
                {user.name}
              </p>

              <p>
                <strong>
                  Account Number:
                </strong>{" "}
                {user.accountNumber}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-400">
                  Active
                </span>
              </p>
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
      />

      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;