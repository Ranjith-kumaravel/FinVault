# 💳 FinVault - Modern Digital Banking Platform

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

### Enterprise-Level MERN Banking Application

*A secure, scalable, and modern digital banking platform built using the MERN stack, featuring authentication, real-time balance management, money transfers, transaction history, and downloadable PDF statements.*

---

## 🚀 Overview

FinVault is a full-stack banking application designed with real-world software engineering principles. The project demonstrates secure authentication, database management, RESTful API design, responsive frontend architecture, and clean code organization.

This project was built to simulate the core functionalities of a modern digital banking system while following industry-standard development practices.

---

# ✨ Features

### 🔐 Authentication

* Secure User Registration
* Secure Login System
* JWT Authentication
* Protected API Routes
* Password Encryption using Bcrypt

---

### 💰 Banking Features

* Account Dashboard
* Account Details
* Current Balance
* Secure Money Transfer
* Transaction History
* PDF Statement Download
* Balance Validation
* Receiver Verification
* Instant Balance Updates

---

### 🎨 User Experience

* Responsive Design
* Modern UI
* Smooth Animations
* Clean Dashboard
* Professional Layout
* Mobile Friendly

---

### ⚙ Backend Features

* REST API
* MongoDB Database
* Express Server
* JWT Middleware
* Error Handling
* Modular MVC Architecture

---

# 🛠 Tech Stack

| Frontend     | Backend    | Database            | Authentication   |
| ------------ | ---------- | ------------------- | ---------------- |
| React 19     | Express.js | MongoDB             | JWT              |
| Tailwind CSS | Node.js    | Mongoose            | Bcrypt           |
| Axios        | REST API   | MongoDB Atlas Ready | Protected Routes |

---

# 📂 Project Structure

```
FinVault/

├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
└── backend/
    │
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── server.js
    └── package.json
```

---

# 🔄 Application Workflow

```
User
   │
   ▼

React Frontend

   │
Axios Requests

   ▼

Express REST API

   │

JWT Authentication

   ▼

MongoDB Database

   │

Response

   ▼

Updated Dashboard
```

---

# 🔒 Security

✔ JWT Authentication

✔ Password Hashing using Bcrypt

✔ Protected API Routes

✔ Authentication Middleware

✔ Secure REST Architecture

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/finvault.git
```

```
cd finvault
```

---

## Install Backend

```bash
cd backend
npm install
```

Run Backend

```bash
npm start
```

or

```bash
nodemon server.js
```

---

## Install Frontend

```bash
cd frontend
npm install
```

Run Frontend

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5001

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY
```

---

# 📡 REST API

## Authentication

```
POST /signup

POST /login
```

---

## Account

```
GET /account/:accountNumber

GET /balance/:accountNumber
```

---

## Transactions

```
POST /transfer
```

---

# 📸 Screenshots

> Add these screenshots before uploading to GitHub.

* Login Page
* Register Page
* Dashboard
* Transfer Money
* Transaction History
* PDF Statement
* Responsive Mobile View

---

# 📈 Future Improvements

* Email Notifications
* Two-Factor Authentication
* UPI Payments
* QR Code Payments
* Admin Dashboard
* Spending Analytics
* Budget Planner
* Investment Module
* AI Financial Assistant
* Dark Mode

---

# 🧪 Testing Checklist

* User Registration
* User Login
* JWT Validation
* Money Transfer
* Balance Update
* Transaction History
* Invalid Credentials
* Unauthorized Access
* PDF Download

---

# 💡 Software Engineering Principles

* Modular Architecture
* MVC Pattern
* Component-Based Design
* RESTful API Design
* Clean Code
* Separation of Concerns
* Reusable Components
* Secure Authentication
* Responsive UI
* Scalable Folder Structure

---

# 🌟 Why This Project?

This project demonstrates practical full-stack engineering skills beyond CRUD applications by integrating authentication, secure transactions, database management, REST APIs, modular architecture, and a polished user experience. It reflects the type of application structure commonly used in production-grade web systems.

---

# 👨‍💻 Developer

**K. Ranjith**

B.Tech Information Technology

Passionate Full Stack Developer focused on building scalable and user-centric web applications.

---

# ⭐ If you found this project helpful

Give this repository a ⭐ and feel free to contribute!

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ Designed & Developed with ❤️ by K. Ranjith

</div>
