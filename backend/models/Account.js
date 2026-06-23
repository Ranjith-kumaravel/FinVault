const mongoose = require("mongoose");

const transactionSchema =
  new mongoose.Schema({
    type: {
      type: String,
      enum: [
        "Deposit",
        "Withdraw",
        "Transfer Out",
        "Transfer In",
      ],
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    transactionId: {
      type: String,
    },
    receiverAccount: {
      type: String,
    },
    receiverName: {
      type: String,
    },
    senderAccount: {
      type: String,
    },
    senderName: {
      type: String,
    },
    description: {
      type: String,
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
