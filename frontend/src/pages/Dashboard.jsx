<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import bankingBg from "../assets/bank-img1.png";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  getBalance,
  deposit,
  withdraw,
  getAccount,
  transferMoney,
} from "../services/api";

function Dashboard({
  user,
  setUser,
  onLogout,
}) {
  const [hideBalance, setHideBalance] =
    useState(
      localStorage.getItem("hideBalance") ===
        "true"
    );

  const [rememberLogin, setRememberLogin] =
    useState(true);

  const [autoLogout, setAutoLogout] =
    useState(true);

  const [biometric, setBiometric] =
    useState(true);

  const [depositAlerts, setDepositAlerts] =
    useState(true);

  const [
    withdrawAlerts,
    setWithdrawAlerts,
  ] = useState(true);

  const [visibleCount, setVisibleCount] =
    useState(10);

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

  const [transferForm, setTransferForm] =
    useState({
      fromAccount: user.accountNumber,
      toAccountNumber: "",
      receiverName: "",
      amount: "",
      description: "",
    });

  const [transferLoading, setTransferLoading] =
    useState(false);

  const [showTransferConfirm, setShowTransferConfirm] =
    useState(false);

  const [transferReceipt, setTransferReceipt] =
    useState(null);

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

  const fetchHistory = async () => {
    try {
      const response = await getAccount(
        user.accountNumber
      );

      const transactions =
        response.data.transactions || [];

      setHistory(transactions);

      const deposits = transactions
        .filter(
          (item) =>
            item.type === "Deposit" ||
            item.type === "Transfer In"
        )
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

      const withdrawals = transactions
        .filter(
          (item) =>
            item.type === "Withdraw" ||
            item.type === "Transfer Out"
        )
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

      setTotalDeposit(deposits);
      setTotalWithdraw(withdrawals);
    } catch (err) {
      console.log(err);
    }
  };

/*
 try {
    console.log("fetchHistory running...");

    const response = await getAccount(
      user.accountNumber
    );

    console.log("API Response:", response.data);

    const transactions =
      response.data.transactions || [];

    console.log("Transactions:", transactions);

    setHistory(transactions);
*/

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

      await fetchHistory();

      setUser({
        ...user,
        balance: response.data.balance,
      });

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

      await fetchHistory();

      setUser({
        ...user,
        balance: response.data.balance,
      });

      setAmount("");
    } catch (err) {
      setTransactionStatus("idle");
      alert("Insufficient Balance");
    }
  };

  const handleTransferInput = (e) => {
    const { name, value } = e.target;

    setTransferForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmTransfer = () => {
    if (
      !transferForm.toAccountNumber.trim() ||
      !transferForm.receiverName.trim() ||
      !transferForm.amount ||
      !transferForm.description.trim()
    ) {
      alert("Please fill all transfer fields");
      return;
    }

    if (Number(transferForm.amount) <= 0) {
      alert(
        "Transfer amount must be greater than zero"
      );
      return;
    }

    if (
      transferForm.fromAccount.trim() ===
      transferForm.toAccountNumber.trim()
    ) {
      alert(
        "You cannot transfer money to your own account"
      );
      return;
    }

    setShowTransferConfirm(true);
  };

  const executeTransfer = async () => {
    try {
      setTransferLoading(true);

      const response = await transferMoney({
        toAccountNumber:
          transferForm.toAccountNumber,
        receiverName: transferForm.receiverName,
        amount: Number(transferForm.amount),
        description: transferForm.description,
      });

      setTransferReceipt(response.data.receipt);
      setBalance(response.data.balance);

      setUser({
        ...user,
        balance: response.data.balance,
      });

      await fetchHistory();

      setTransferForm({
        fromAccount: user.accountNumber,
        toAccountNumber: "",
        receiverName: "",
        amount: "",
        description: "",
      });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Transfer failed"
      );
    } finally {
      setTransferLoading(false);
      setShowTransferConfirm(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hideBalance",
      hideBalance
    );
  }, [hideBalance]);

  useEffect(() => {
    setTransferForm((prev) => ({
      ...prev,
      fromAccount: user.accountNumber,
    }));
  }, [user.accountNumber]);

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

  const downloadTransferReceipt = () => {
  if (!transferReceipt) return;

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("FinVault Transfer Receipt", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Transaction ID: ${transferReceipt.transactionId}`,
    20,
    40
  );

  doc.text(
    `Date: ${new Date(
      transferReceipt.date
    ).toLocaleString()}`,
    20,
    50
  );

  doc.text(
    `Sender: ${transferReceipt.sender}`,
    20,
    60
  );

  doc.text(
    `Sender Account: ${transferReceipt.senderAccountNumber}`,
    20,
    70
  );

  doc.text(
    `Receiver: ${transferReceipt.receiver}`,
    20,
    80
  );

  doc.text(
    `Receiver Account: ${transferReceipt.receiverAccountNumber}`,
    20,
    90
  );

  doc.text(
    `Amount: Rs.${transferReceipt.amount}`,
    20,
    100
  );

  doc.text(
    `Description: ${transferReceipt.description}`,
    20,
    110
  );

  doc.text(
    `Status: ${transferReceipt.status}`,
    20,
    120
  );

  doc.save(
    `Receipt-${transferReceipt.transactionId}.pdf`
  );
};

const downloadStatement = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("FinVault Account Statement", 20, 20);

  doc.text(
    `Account Holder: ${user.name}`,
    20,
    35
  );

  doc.text(
    `Account Number: ${user.accountNumber}`,
    20,
    45
  );

  doc.text(
    `Balance: Rs.${balance}`,
    20,
    55
  );

  autoTable(doc, {
    startY: 70,
    head: [
      [
        "Type",
        "Amount",
        "Date",
      ],
    ],
    body: history.map((tx) => [
      tx.type,
      tx.amount,
      new Date(
        tx.date
      ).toLocaleString(),
    ]),
  });

  doc.save("FinVault-Statement.pdf");
};

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
              {transactionStatus ===
                "processing" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="mt-8 bg-yellow-500/10 border border-yellow-400/30 rounded-3xl p-6"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

                    <h2 className="text-2xl font-bold mt-4">
                      Processing Transaction...
                    </h2>

                    <p className="text-gray-300 mt-2">
                      Please wait while we
                      complete your transaction.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {transactionStatus ===
                "success" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
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
                      Your account has been
                      updated.
                    </p>

                    <button
                      onClick={() =>
                        setTransactionStatus(
                          "idle"
                        )
                      }
                      className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">
                Transfer Money
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="fromAccount"
                  value={transferForm.fromAccount}
                  readOnly
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
                  placeholder="From Account Number"
                />

                <input
                  type="text"
                  name="toAccountNumber"
                  value={transferForm.toAccountNumber}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="To Account Number"
                />

                <input
                  type="text"
                  name="receiverName"
                  value={transferForm.receiverName}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="Receiver Name"
                />

                <input
                  type="number"
                  name="amount"
                  value={transferForm.amount}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="Amount"
                />

                <textarea
                  name="description"
                  value={transferForm.description}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="Description"
                  rows={3}
                />

                <button
                  onClick={confirmTransfer}
                  disabled={transferLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  {transferLoading
                    ? "Processing..."
                    : "Transfer"}
                </button>
              </div>

              <AnimatePresence>
                {transferReceipt && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="mt-8 bg-green-500/10 border border-green-400/30 rounded-3xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-green-400">
                        ✅ Transfer Receipt
                      </h2>

                      <button
  onClick={downloadTransferReceipt}
  className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl"
>
  Download PDF
</button>

                      <button
                        onClick={() =>
                          setTransferReceipt(null)
                        }
                        className="text-gray-300 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2 text-gray-200">
                      <p>
                        <span className="font-semibold">
                          Transaction ID:
                        </span>{" "}
                        {
                          transferReceipt.transactionId
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Date & Time:
                        </span>{" "}
                        {new Date(
                          transferReceipt.date
                        ).toLocaleString()}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Status:
                        </span>{" "}
                        <span className="text-green-400">
                          {
                            transferReceipt.status
                          }
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold">
                          Sender Name:
                        </span>{" "}
                        {transferReceipt.sender}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Sender Account:
                        </span>{" "}
                        {
                          transferReceipt.senderAccountNumber
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Name:
                        </span>{" "}
                        {transferReceipt.receiver}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Account:
                        </span>{" "}
                        {
                          transferReceipt.receiverAccountNumber
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Amount:
                        </span>{" "}
                        <span className="text-cyan-400 font-bold">
                          ₹{transferReceipt.amount}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold">
                          Description:
                        </span>{" "}
                        {
                          transferReceipt.description
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showTransferConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-md w-full"
                  >
                    <h2 className="text-2xl font-bold mb-6">
                      Confirm Transfer
                    </h2>

                    <div className="space-y-3 text-gray-200">
                      <p>
                        <span className="font-semibold">
                          Sender Account:
                        </span>{" "}
                        {transferForm.fromAccount}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Account:
                        </span>{" "}
                        {
                          transferForm.toAccountNumber
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Name:
                        </span>{" "}
                        {transferForm.receiverName}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Amount:
                        </span>{" "}
                        <span className="text-cyan-400 font-bold text-xl">
                          ₹{transferForm.amount}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold">
                          Description:
                        </span>{" "}
                        {
                          transferForm.description
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <button
                        onClick={() =>
                          setShowTransferConfirm(
                            false
                          )
                        }
                        disabled={transferLoading}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={executeTransfer}
                        disabled={transferLoading}
                        className="bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        {transferLoading
                          ? "Processing..."
                          : "Confirm Transfer"}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "history":
        return (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">
    Transaction History
  </h1>

  <button
    onClick={downloadStatement}
    className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl"
  >
    Download Statement PDF
  </button>
</div>

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
                {[...history]
                  .reverse()
                  .slice(0, visibleCount)
                  .map((item, index) => (
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

            <div className="flex justify-center mt-6">
              {visibleCount < history.length && (
                <button
                  onClick={() =>
                    setVisibleCount(
                      (prev) => prev + 10
                    )
                  }
                  className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
                >
                  Load 10 More
                </button>
              )}

              {visibleCount > 10 && (
                <button
                  onClick={() =>
                    setVisibleCount(10)
                  }
                  className="ml-4 bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-xl"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-8">
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full animate-pulse"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
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
                        {user?.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <label className="absolute bottom-2 right-2 bg-cyan-500 hover:bg-cyan-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110">
                    ✏️

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        handleProfileImage
                      }
                    />
                  </label>
                </div>

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
                        {hideBalance
                          ? "₹••••••"
                          : `₹${balance}`}
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
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">
              ⚙️ Settings
            </h1>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                👤 Profile
              </h2>

              <p>
                Name: {user.name}
              </p>

              <p>
                Account: {user.accountNumber}
              </p>

              <p className="text-green-400 mt-2">
                🟢 Active
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                🔒 Security
              </h2>

              <div className="space-y-4">
                <label className="flex justify-between">
                  Remember Login

                  <input
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={() =>
                      setRememberLogin(
                        !rememberLogin
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Hide Balance

                  <input
                    type="checkbox"
                    checked={hideBalance}
                    onChange={() =>
                      setHideBalance(
                        !hideBalance
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Auto Logout

                  <input
                    type="checkbox"
                    checked={autoLogout}
                    onChange={() =>
                      setAutoLogout(
                        !autoLogout
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Biometric Login

                  <input
                    type="checkbox"
                    checked={biometric}
                    onChange={() =>
                      setBiometric(
                        !biometric
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                🔔 Notifications
              </h2>

              <div className="space-y-4">
                <label className="flex justify-between">
                  Deposit Alerts

                  <input
                    type="checkbox"
                    checked={depositAlerts}
                    onChange={() =>
                      setDepositAlerts(
                        !depositAlerts
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Withdrawal Alerts

                  <input
                    type="checkbox"
                    checked={withdrawAlerts}
                    onChange={() =>
                      setWithdrawAlerts(
                        !withdrawAlerts
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-2xl p-6">
                <p>Total Deposits</p>

                <h2 className="text-3xl font-bold text-green-400">
                  ₹{totalDeposit}
                </h2>
              </div>

              <div className="bg-red-500/10 rounded-2xl p-6">
                <p>Total Withdrawals</p>

                <h2 className="text-3xl font-bold text-red-400">
                  ₹{totalWithdraw}
                </h2>
              </div>

              <div className="bg-cyan-500/10 rounded-2xl p-6">
                <p>Total Transactions</p>

                <h2 className="text-3xl font-bold text-cyan-400">
                  {history.length}
                </h2>
              </div>
            </div>

           <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
  <h2 className="text-2xl font-bold mb-4">
    ℹ️ About FinVault
  </h2>

  <ul className="space-y-3">
    <li>🚀 Version 1.0</li>
    <li>💻 MERN Stack Banking Application</li>
    <li>🔐 JWT Authentication</li>
    <li>💸 Money Transfer System</li>
    <li>📄 PDF Statements & Receipts</li>
  </ul>
</div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
  <h2 className="text-2xl font-bold mb-5">
    👨‍💻 Developer
  </h2>

  <div className="space-y-4">

    <a
      href="https://github.com/Ranjith-kumaravel"
      target="_blank"
      rel="noreferrer"
      className="block bg-black/20 p-4 rounded-xl hover:bg-black/40"
    >
      🔗 GitHub
    </a>

    <a
      href="https://www.linkedin.com/in/ranjith-k-150833395?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
      target="_blank"
      rel="noreferrer"
      className="block bg-blue-500/20 p-4 rounded-xl hover:bg-blue-500/40"
    >
      💼 LinkedIn
    </a>

    <div className="bg-green-500/20 p-4 rounded-xl">
  <p>📧 Email:  ranjithk160106@gmail.com</p>

  <button
    onClick={() => {
      navigator.clipboard.writeText(
        "ranjithk160106@gmail.com"
      );
      alert("Email copied!");
    }}
    className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
  >
    Copy Email
  </button>
</div>

    <a
      href="https://www.instagram.com/_ranjith_93_?igsh=MXBlY2d0NGpvb2Ywbg%3D%3D&utm_source=qr"
      target="_blank"
      rel="noreferrer"
      className="block bg-pink-500/20 p-4 rounded-xl hover:bg-pink-500/40"
    >
      📸 Instagram
    </a>

  </div>
</div>

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
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse"></div>

                <div className="absolute top-8 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>

                <div className="absolute bottom-8 right-10 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6">
                    Recent Activity
                  </h2>

                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                      <div className="text-7xl animate-bounce mb-6">
                        🏦
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>

                          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                        </div>

                        <span className="text-green-400 font-semibold">
                          Waiting for new
                          transactions...
                        </span>
                      </div>

                      <p className="text-gray-300 max-w-xs">
                        Your recent banking
                        activities will
                        automatically appear
                        here once you make a
                        deposit or withdrawal.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-72 overflow-y-auto">
                      {[...history]
  .reverse()
  .slice(0, 5)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-2xl"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  item.type ===
                                    "Deposit" ||
                                  item.type ===
                                    "Transfer In"
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              />

                              <div>
                                <p className="font-semibold">
                                  {item.type}
                                </p>

                                <p className="text-sm text-gray-400">
                                  Successful
                                  Transaction
                                </p>
                              </div>
                            </div>

                            <span
                              className={`font-bold text-lg ${
                                item.type ===
                                  "Deposit" ||
                                item.type ===
                                  "Transfer In"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {item.type ===
                                "Deposit" ||
                              item.type ===
                                "Transfer In"
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

  //console.log("History State:", history);

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
=======
import { motion, AnimatePresence } from "framer-motion";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import bankingBg from "../assets/bank-img1.png";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  getBalance,
  deposit,
  withdraw,
  getAccount,
  transferMoney,
} from "../services/api";

function Dashboard({
  user,
  setUser,
  onLogout,
}) {
  const [hideBalance, setHideBalance] =
    useState(
      localStorage.getItem("hideBalance") ===
        "true"
    );

  const [rememberLogin, setRememberLogin] =
    useState(true);

  const [autoLogout, setAutoLogout] =
    useState(true);

  const [biometric, setBiometric] =
    useState(true);

  const [depositAlerts, setDepositAlerts] =
    useState(true);

  const [
    withdrawAlerts,
    setWithdrawAlerts,
  ] = useState(true);

  const [visibleCount, setVisibleCount] =
    useState(10);

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

  const [transferForm, setTransferForm] =
    useState({
      fromAccount: user.accountNumber,
      toAccountNumber: "",
      receiverName: "",
      amount: "",
      description: "",
    });

  const [transferLoading, setTransferLoading] =
    useState(false);

  const [showTransferConfirm, setShowTransferConfirm] =
    useState(false);

  const [transferReceipt, setTransferReceipt] =
    useState(null);

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

  const fetchHistory = async () => {
    try {
      const response = await getAccount(
        user.accountNumber
      );

      const transactions =
        response.data.transactions || [];

      setHistory(transactions);

      const deposits = transactions
        .filter(
          (item) =>
            item.type === "Deposit" ||
            item.type === "Transfer In"
        )
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

      const withdrawals = transactions
        .filter(
          (item) =>
            item.type === "Withdraw" ||
            item.type === "Transfer Out"
        )
        .reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

      setTotalDeposit(deposits);
      setTotalWithdraw(withdrawals);
    } catch (err) {
      console.log(err);
    }
  };

/*
 try {
    console.log("fetchHistory running...");

    const response = await getAccount(
      user.accountNumber
    );

    console.log("API Response:", response.data);

    const transactions =
      response.data.transactions || [];

    console.log("Transactions:", transactions);

    setHistory(transactions);
*/

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

      await fetchHistory();

      setUser({
        ...user,
        balance: response.data.balance,
      });

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

      await fetchHistory();

      setUser({
        ...user,
        balance: response.data.balance,
      });

      setAmount("");
    } catch (err) {
      setTransactionStatus("idle");
      alert("Insufficient Balance");
    }
  };

  const handleTransferInput = (e) => {
    const { name, value } = e.target;

    setTransferForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmTransfer = () => {
    if (
      !transferForm.toAccountNumber.trim() ||
      !transferForm.receiverName.trim() ||
      !transferForm.amount ||
      !transferForm.description.trim()
    ) {
      alert("Please fill all transfer fields");
      return;
    }

    if (Number(transferForm.amount) <= 0) {
      alert(
        "Transfer amount must be greater than zero"
      );
      return;
    }

    if (
      transferForm.fromAccount.trim() ===
      transferForm.toAccountNumber.trim()
    ) {
      alert(
        "You cannot transfer money to your own account"
      );
      return;
    }

    setShowTransferConfirm(true);
  };

  const executeTransfer = async () => {
    try {
      setTransferLoading(true);

      const response = await transferMoney({
        toAccountNumber:
          transferForm.toAccountNumber,
        receiverName: transferForm.receiverName,
        amount: Number(transferForm.amount),
        description: transferForm.description,
      });

      setTransferReceipt(response.data.receipt);
      setBalance(response.data.balance);

      setUser({
        ...user,
        balance: response.data.balance,
      });

      await fetchHistory();

      setTransferForm({
        fromAccount: user.accountNumber,
        toAccountNumber: "",
        receiverName: "",
        amount: "",
        description: "",
      });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Transfer failed"
      );
    } finally {
      setTransferLoading(false);
      setShowTransferConfirm(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hideBalance",
      hideBalance
    );
  }, [hideBalance]);

  useEffect(() => {
    setTransferForm((prev) => ({
      ...prev,
      fromAccount: user.accountNumber,
    }));
  }, [user.accountNumber]);

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

  const downloadTransferReceipt = () => {
  if (!transferReceipt) return;

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("FinVault Transfer Receipt", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Transaction ID: ${transferReceipt.transactionId}`,
    20,
    40
  );

  doc.text(
    `Date: ${new Date(
      transferReceipt.date
    ).toLocaleString()}`,
    20,
    50
  );

  doc.text(
    `Sender: ${transferReceipt.sender}`,
    20,
    60
  );

  doc.text(
    `Sender Account: ${transferReceipt.senderAccountNumber}`,
    20,
    70
  );

  doc.text(
    `Receiver: ${transferReceipt.receiver}`,
    20,
    80
  );

  doc.text(
    `Receiver Account: ${transferReceipt.receiverAccountNumber}`,
    20,
    90
  );

  doc.text(
    `Amount: Rs.${transferReceipt.amount}`,
    20,
    100
  );

  doc.text(
    `Description: ${transferReceipt.description}`,
    20,
    110
  );

  doc.text(
    `Status: ${transferReceipt.status}`,
    20,
    120
  );

  doc.save(
    `Receipt-${transferReceipt.transactionId}.pdf`
  );
};

const downloadStatement = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("FinVault Account Statement", 20, 20);

  doc.text(
    `Account Holder: ${user.name}`,
    20,
    35
  );

  doc.text(
    `Account Number: ${user.accountNumber}`,
    20,
    45
  );

  doc.text(
    `Balance: Rs.${balance}`,
    20,
    55
  );

  autoTable(doc, {
    startY: 70,
    head: [
      [
        "Type",
        "Amount",
        "Date",
      ],
    ],
    body: history.map((tx) => [
      tx.type,
      tx.amount,
      new Date(
        tx.date
      ).toLocaleString(),
    ]),
  });

  doc.save("FinVault-Statement.pdf");
};

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
              {transactionStatus ===
                "processing" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="mt-8 bg-yellow-500/10 border border-yellow-400/30 rounded-3xl p-6"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

                    <h2 className="text-2xl font-bold mt-4">
                      Processing Transaction...
                    </h2>

                    <p className="text-gray-300 mt-2">
                      Please wait while we
                      complete your transaction.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {transactionStatus ===
                "success" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
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
                      Your account has been
                      updated.
                    </p>

                    <button
                      onClick={() =>
                        setTransactionStatus(
                          "idle"
                        )
                      }
                      className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">
                Transfer Money
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="fromAccount"
                  value={transferForm.fromAccount}
                  readOnly
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
                  placeholder="From Account Number"
                />

                <input
                  type="text"
                  name="toAccountNumber"
                  value={transferForm.toAccountNumber}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="To Account Number"
                />

                <input
                  type="text"
                  name="receiverName"
                  value={transferForm.receiverName}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="Receiver Name"
                />

                <input
                  type="number"
                  name="amount"
                  value={transferForm.amount}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="Amount"
                />

                <textarea
                  name="description"
                  value={transferForm.description}
                  onChange={handleTransferInput}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20"
                  placeholder="Description"
                  rows={3}
                />

                <button
                  onClick={confirmTransfer}
                  disabled={transferLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  {transferLoading
                    ? "Processing..."
                    : "Transfer"}
                </button>
              </div>

              <AnimatePresence>
                {transferReceipt && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="mt-8 bg-green-500/10 border border-green-400/30 rounded-3xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-green-400">
                        ✅ Transfer Receipt
                      </h2>

                      <button
  onClick={downloadTransferReceipt}
  className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl"
>
  Download PDF
</button>

                      <button
                        onClick={() =>
                          setTransferReceipt(null)
                        }
                        className="text-gray-300 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2 text-gray-200">
                      <p>
                        <span className="font-semibold">
                          Transaction ID:
                        </span>{" "}
                        {
                          transferReceipt.transactionId
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Date & Time:
                        </span>{" "}
                        {new Date(
                          transferReceipt.date
                        ).toLocaleString()}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Status:
                        </span>{" "}
                        <span className="text-green-400">
                          {
                            transferReceipt.status
                          }
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold">
                          Sender Name:
                        </span>{" "}
                        {transferReceipt.sender}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Sender Account:
                        </span>{" "}
                        {
                          transferReceipt.senderAccountNumber
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Name:
                        </span>{" "}
                        {transferReceipt.receiver}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Account:
                        </span>{" "}
                        {
                          transferReceipt.receiverAccountNumber
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Amount:
                        </span>{" "}
                        <span className="text-cyan-400 font-bold">
                          ₹{transferReceipt.amount}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold">
                          Description:
                        </span>{" "}
                        {
                          transferReceipt.description
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showTransferConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                    }}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-md w-full"
                  >
                    <h2 className="text-2xl font-bold mb-6">
                      Confirm Transfer
                    </h2>

                    <div className="space-y-3 text-gray-200">
                      <p>
                        <span className="font-semibold">
                          Sender Account:
                        </span>{" "}
                        {transferForm.fromAccount}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Account:
                        </span>{" "}
                        {
                          transferForm.toAccountNumber
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Receiver Name:
                        </span>{" "}
                        {transferForm.receiverName}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Amount:
                        </span>{" "}
                        <span className="text-cyan-400 font-bold text-xl">
                          ₹{transferForm.amount}
                        </span>
                      </p>

                      <p>
                        <span className="font-semibold">
                          Description:
                        </span>{" "}
                        {
                          transferForm.description
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <button
                        onClick={() =>
                          setShowTransferConfirm(
                            false
                          )
                        }
                        disabled={transferLoading}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={executeTransfer}
                        disabled={transferLoading}
                        className="bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        {transferLoading
                          ? "Processing..."
                          : "Confirm Transfer"}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "history":
        return (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">
    Transaction History
  </h1>

  <button
    onClick={downloadStatement}
    className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl"
  >
    Download Statement PDF
  </button>
</div>

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
                {[...history]
                  .reverse()
                  .slice(0, visibleCount)
                  .map((item, index) => (
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

            <div className="flex justify-center mt-6">
              {visibleCount < history.length && (
                <button
                  onClick={() =>
                    setVisibleCount(
                      (prev) => prev + 10
                    )
                  }
                  className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
                >
                  Load 10 More
                </button>
              )}

              {visibleCount > 10 && (
                <button
                  onClick={() =>
                    setVisibleCount(10)
                  }
                  className="ml-4 bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-xl"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-8">
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full animate-pulse"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
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
                        {user?.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <label className="absolute bottom-2 right-2 bg-cyan-500 hover:bg-cyan-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110">
                    ✏️

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        handleProfileImage
                      }
                    />
                  </label>
                </div>

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
                        {hideBalance
                          ? "₹••••••"
                          : `₹${balance}`}
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
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">
              ⚙️ Settings
            </h1>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                👤 Profile
              </h2>

              <p>
                Name: {user.name}
              </p>

              <p>
                Account: {user.accountNumber}
              </p>

              <p className="text-green-400 mt-2">
                🟢 Active
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                🔒 Security
              </h2>

              <div className="space-y-4">
                <label className="flex justify-between">
                  Remember Login

                  <input
                    type="checkbox"
                    checked={rememberLogin}
                    onChange={() =>
                      setRememberLogin(
                        !rememberLogin
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Hide Balance

                  <input
                    type="checkbox"
                    checked={hideBalance}
                    onChange={() =>
                      setHideBalance(
                        !hideBalance
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Auto Logout

                  <input
                    type="checkbox"
                    checked={autoLogout}
                    onChange={() =>
                      setAutoLogout(
                        !autoLogout
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Biometric Login

                  <input
                    type="checkbox"
                    checked={biometric}
                    onChange={() =>
                      setBiometric(
                        !biometric
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                🔔 Notifications
              </h2>

              <div className="space-y-4">
                <label className="flex justify-between">
                  Deposit Alerts

                  <input
                    type="checkbox"
                    checked={depositAlerts}
                    onChange={() =>
                      setDepositAlerts(
                        !depositAlerts
                      )
                    }
                  />
                </label>

                <label className="flex justify-between">
                  Withdrawal Alerts

                  <input
                    type="checkbox"
                    checked={withdrawAlerts}
                    onChange={() =>
                      setWithdrawAlerts(
                        !withdrawAlerts
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-2xl p-6">
                <p>Total Deposits</p>

                <h2 className="text-3xl font-bold text-green-400">
                  ₹{totalDeposit}
                </h2>
              </div>

              <div className="bg-red-500/10 rounded-2xl p-6">
                <p>Total Withdrawals</p>

                <h2 className="text-3xl font-bold text-red-400">
                  ₹{totalWithdraw}
                </h2>
              </div>

              <div className="bg-cyan-500/10 rounded-2xl p-6">
                <p>Total Transactions</p>

                <h2 className="text-3xl font-bold text-cyan-400">
                  {history.length}
                </h2>
              </div>
            </div>

           <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
  <h2 className="text-2xl font-bold mb-4">
    ℹ️ About FinVault
  </h2>

  <ul className="space-y-3">
    <li>🚀 Version 1.0</li>
    <li>💻 MERN Stack Banking Application</li>
    <li>🔐 JWT Authentication</li>
    <li>💸 Money Transfer System</li>
    <li>📄 PDF Statements & Receipts</li>
  </ul>
</div>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
  <h2 className="text-2xl font-bold mb-5">
    👨‍💻 Developer
  </h2>

  <div className="space-y-4">

    <a
      href="https://github.com/Ranjith-kumaravel"
      target="_blank"
      rel="noreferrer"
      className="block bg-black/20 p-4 rounded-xl hover:bg-black/40"
    >
      🔗 GitHub
    </a>

    <a
      href="https://www.linkedin.com/in/ranjith-k-150833395?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
      target="_blank"
      rel="noreferrer"
      className="block bg-blue-500/20 p-4 rounded-xl hover:bg-blue-500/40"
    >
      💼 LinkedIn
    </a>

    <div className="bg-green-500/20 p-4 rounded-xl">
  <p>📧 Email:  ranjithk160106@gmail.com</p>

  <button
    onClick={() => {
      navigator.clipboard.writeText(
        "ranjithk160106@gmail.com"
      );
      alert("Email copied!");
    }}
    className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
  >
    Copy Email
  </button>
</div>

    <a
      href="https://www.instagram.com/_ranjith_93_?igsh=MXBlY2d0NGpvb2Ywbg%3D%3D&utm_source=qr"
      target="_blank"
      rel="noreferrer"
      className="block bg-pink-500/20 p-4 rounded-xl hover:bg-pink-500/40"
    >
      📸 Instagram
    </a>

  </div>
</div>

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
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 animate-pulse"></div>

                <div className="absolute top-8 left-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>

                <div className="absolute bottom-8 right-10 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6">
                    Recent Activity
                  </h2>

                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                      <div className="text-7xl animate-bounce mb-6">
                        🏦
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>

                          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                        </div>

                        <span className="text-green-400 font-semibold">
                          Waiting for new
                          transactions...
                        </span>
                      </div>

                      <p className="text-gray-300 max-w-xs">
                        Your recent banking
                        activities will
                        automatically appear
                        here once you make a
                        deposit or withdrawal.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-72 overflow-y-auto">
                      {[...history]
  .reverse()
  .slice(0, 5)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition-all duration-300 p-4 rounded-2xl"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  item.type ===
                                    "Deposit" ||
                                  item.type ===
                                    "Transfer In"
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                }`}
                              />

                              <div>
                                <p className="font-semibold">
                                  {item.type}
                                </p>

                                <p className="text-sm text-gray-400">
                                  Successful
                                  Transaction
                                </p>
                              </div>
                            </div>

                            <span
                              className={`font-bold text-lg ${
                                item.type ===
                                  "Deposit" ||
                                item.type ===
                                  "Transfer In"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {item.type ===
                                "Deposit" ||
                              item.type ===
                                "Transfer In"
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

  //console.log("History State:", history);

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
>>>>>>> 72013941db107fbe5324f851cececbb36dff5b68
                                  Transaction
                                </p>
                              </div>
                            </div>

                            <span
                              className={`font-bold text-lg ${
                                item.type ===
                                  "Deposit" ||
                                item.type ===
                                  "Transfer In"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {item.type ===
                                "Deposit" ||
                              item.type ===
                                "Transfer In"
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

  //console.log("History State:", history);

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