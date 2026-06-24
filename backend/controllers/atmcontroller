const jwt = require("jsonwebtoken");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const crypto = require("crypto");

const generateTransactionId = () => {
  return (
    "TXN" +
    Date.now() +
    crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()
  );
};

const signup = async (req, res) => {
  try {
    const { name, accountNumber, pin } =
      req.body;

    const existingUser =
      await Account.findOne({
        accountNumber,
      });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    const hashedPin = await bcrypt.hash(
      pin,
      10
    );

    const account = await Account.create({
      name,
      accountNumber,
      pin: hashedPin,
      balance: 0,
      transactions: [],
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: account._id,
        name: account.name,
        accountNumber: account.accountNumber,
        balance: account.balance,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { accountNumber, pin } = req.body;

    const account = await Account.findOne({
      accountNumber,
    });

    if (!account) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      pin,
      account.pin
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: account._id,
        accountNumber:
          account.accountNumber,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: account._id,
        name: account.name,
        accountNumber: account.accountNumber,
        balance: account.balance,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const checkBalance = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await Account.findOne({
      accountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json({
      balance: account.balance,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deposit = async (req, res) => {
  try {
    const { accountNumber, amount } =
      req.body;

    const numAmount = Number(amount);

    if (
      isNaN(numAmount) ||
      numAmount <= 0
    ) {
      return res.status(400).json({
        message:
          "Amount must be a positive number",
      });
    }

    const account = await Account.findOne({
      accountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    account.balance += numAmount;

    account.transactions.push({
      type: "Deposit",
      amount: numAmount,
      date: new Date(),
    });

    await account.save();

    res.json({
      message: "Deposit successful",
      balance: account.balance,
      transactions: account.transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const withdraw = async (req, res) => {
  try {
    const { accountNumber, amount } =
      req.body;

    const numAmount = Number(amount);

    if (
      isNaN(numAmount) ||
      numAmount <= 0
    ) {
      return res.status(400).json({
        message:
          "Amount must be a positive number",
      });
    }

    const account = await Account.findOne({
      accountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (account.balance < numAmount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    account.balance -= numAmount;

    account.transactions.push({
      type: "Withdraw",
      amount: numAmount,
      date: new Date(),
    });

    await account.save();

    res.json({
      message: "Withdrawal successful",
      balance: account.balance,
      transactions: account.transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await Account.findOne({
      accountNumber,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json({
      id: account._id,
      name: account.name,
      accountNumber:
        account.accountNumber,
      balance: account.balance,
      transactions: account.transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const transferMoney = async (req, res) => {
  const session =
    await mongoose.startSession();

  try {
    const {
      toAccountNumber,
      receiverName,
      amount,
      description,
    } = req.body;

    const numAmount = Number(amount);

    if (
      !toAccountNumber ||
      !receiverName ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All transfer fields are required",
      });
    }

    if (
      Number.isNaN(numAmount) ||
      numAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Transfer amount must be greater than zero",
      });
    }

    session.startTransaction();

    const sender =
      await Account.findById(
        req.user.id
      ).session(session);

    if (!sender) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message:
          "Sender account not found",
      });
    }

    if (
      sender.accountNumber.trim() ===
      toAccountNumber.trim()
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "You cannot transfer money to your own account",
      });
    }

    const receiver =
      await Account.findOne({
        accountNumber:
          toAccountNumber.trim(),
      }).session(session);

    if (!receiver) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message:
          "Receiver account not found",
      });
    }

    if (
      receiver.name.trim().toLowerCase() !==
      receiverName.trim().toLowerCase()
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Receiver name does not match the account",
      });
    }

    if (sender.balance < numAmount) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const now = new Date();
    const transactionId =
      generateTransactionId();

    sender.balance -= numAmount;
    receiver.balance += numAmount;

    sender.transactions.push({
      type: "Transfer Out",
      amount: numAmount,
      date: now,
      transactionId,
      receiverAccount:
        receiver.accountNumber,
      receiverName: receiver.name,
      description,
    });

    receiver.transactions.push({
      type: "Transfer In",
      amount: numAmount,
      date: now,
      transactionId,
      senderAccount:
        sender.accountNumber,
      senderName: sender.name,
      description,
    });

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();

    return res.json({
      success: true,
      message:
        "Transfer completed successfully",
      receipt: {
        transactionId,
        date: now,
        sender: sender.name,
        senderAccountNumber:
          sender.accountNumber,
        receiver: receiver.name,
        receiverAccountNumber:
          receiver.accountNumber,
        amount: numAmount,
        description,
        status: "Success",
      },
      balance: sender.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Transfer failed",
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  signup,
  login,
  checkBalance,
  deposit,
  withdraw,
  getAccount,
  transferMoney,
};
