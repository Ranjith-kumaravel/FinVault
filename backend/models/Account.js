const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Deposit", "Withdraw"],
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },

  pin: {
    type: String,
    required: true,
  },

  balance: {
    type: Number,
    default: 0,
  },

  transactions: [transactionSchema],
});

module.exports = mongoose.model(
  "Account",
  accountSchema
);