const bcrypt = require("bcrypt");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const auth = require("./middleware/auth");

const app = express();

connectDB();

const Account = require("./models/Account");

// Middleware
app.use(cors());
app.use(express.json());

const {
  signup,
  login,
  checkBalance,
  deposit,
  withdraw,
  getAccount,
  transferMoney,
} = require("./controllers/atmcontroller");

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.post("/signup", signup);
app.post("/login", login);

app.get("/balance/:accountNumber", auth, checkBalance);

app.post("/deposit", auth, deposit);
app.post("/withdraw", auth, withdraw);
app.post("/transfer", auth, transferMoney);

// Get Full Account Details
app.get("/account/:accountNumber", auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      accountNumber: req.params.accountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json({
      id: account._id,
      name: account.name,
      accountNumber: account.accountNumber,
      balance: account.balance,
      transactions: account.transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/history/:accountNumber", auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      accountNumber: req.params.accountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json(account.transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});