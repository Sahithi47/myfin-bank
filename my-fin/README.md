# MyFin Bank

A Full Stack MERN Banking Application developed as a Capstone Project at Great Learning.

---

## Tech Stack

**Frontend** — React.js 18, Redux Toolkit, React Router DOM, Material UI, Axios, Socket.io Client, React Hot Toast

**Backend** — Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Nodemailer, Multer, Socket.io, node-cron

---

## Features

### Customer
- Register with KYC document upload
- Login with Email or Customer ID
- Withdraw money and fund transfer
- View passbook and transaction history
- Apply for loans with EMI preview
- Fixed Deposits and Recurring Deposits
- Beneficiary management
- Real-time chat support
- Password reset via OTP

### Admin
- Manage customer KYC verification
- Approve or reject bank accounts
- Deposit money on behalf of customers
- Approve or reject loans with custom interest rate
- Approve beneficiaries
- Reply to support tickets
- Receive email alerts for zero balance accounts

## Getting Started

### Prerequisites
- Node.js, MongoDB, npm

### Step 1 — Setup Environment Variables

Create a `.env` file inside the `backend` folder and fill in your details:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/myfinbank
JWT_SECRET=myfin_super_secret_key_2024
JWT_EXPIRES_IN=1d
EMAIL_USER=sahithimettu2@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=sahithimettu2@gmail.com
```

> To get your Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords → Generate one

### Step 2 — Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 3 — Start MongoDB

```bash
mongod
```

### Step 4 — Create the Admin Account (Run this once!)

```bash
cd backend
node seed.js
```

This creates the default admin account in the database. You only need to do this once.

✅ Admin created!
   Email    : admin@myfin.com
   Password : Admin@123


### Step 5 — Start the Backend

```bash
cd backend
npm run dev
```

You should see:

✅ Server running on http://localhost:5000
✅ MongoDB Connected: localhost

### Step 6 — Start the Frontend

```bash
cd frontend
npm start
```

App opens at `http://localhost:3000`



## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@myfin.com | Admin@123 |
| Customer | Register at /register | Your own password |

---

## How to Use the App

1. Open `http://localhost:3000/register` and register as a new customer
2. Login as Admin → Go to **Manage Customers** → Approve the customer
3. Login as Customer → Dashboard → Click **Request Bank Account**
4. Admin → **Manage Accounts** → Approve account → Click **Deposit** to add money
5. Customer can now Withdraw, Transfer, Apply for Loans, create FDs, RDs and more!

---

## Running Tests

### Backend Tests (Mocha + Chai + Supertest) — 30 tests

```bash
cd backend
set NODE_ENV=test
npx mocha --timeout 30000 --exit "tests/auth.customer.test.js" "tests/account.test.js" "tests/transaction.test.js"
```

Covers — customer auth, account management, deposits, withdrawals, transfers, loans, FD, RD

### E2E Tests (Cypress) — 4 tests

Make sure both frontend and backend are running, then:

```bash
cd frontend
npx cypress run
```

Covers — page load, invalid login, valid login, logout

-----


## Developer

| Field | Details |
|---|---|
| Name | Bala Sahithi Mettu |
| Email | balasahithi7@gmail.com |
| Program | WIPRO NGA - MERN - FY26 - Cohort 3 |
| Institute | Great Learning |
| Year | 2026 |
