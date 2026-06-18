const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

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
} = require("./controllers/atmcontroller");

// MongoDB Connection
mongoose
  .connect(
    "mongodb://ranjithk160106_db_user:Ranjith123@ac-ehru1ew-shard-00-00.6djcofj.mongodb.net:27017,ac-ehru1ew-shard-00-01.6djcofj.mongodb.net:27017,ac-ehru1ew-shard-00-02.6djcofj.mongodb.net:27017/atmdb?ssl=true&replicaSet=atlas-fplj86-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error");
    console.error(err.message);
  });

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.post("/signup", signup);

app.post("/login", login);

app.get(
  "/balance/:accountNumber",
  checkBalance
);

app.post("/deposit", deposit);

app.post("/withdraw", withdraw);

// Get Full Account Details
app.get(
  "/account/:accountNumber",
  async (req, res) => {
    try {
      const account =
        await Account.findOne({
          accountNumber:
            req.params.accountNumber,
        });

      if (!account) {
        return res.status(404).json({
          message: "Account not found",
        });
      }

      res.json(account);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// OR use controller version
// app.get("/account/:accountNumber", getAccount);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});