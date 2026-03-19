const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendWelcomeEmail = async (email, name) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Welcome to MyFin Bank — Registration Received',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#1a237e">Welcome, ${name}!</h2><p style="color:#424242;line-height:1.8">Thank you for registering with MyFin Bank. We have received your registration request along with your KYC documents.</p><div style="background:#e8eaf6;padding:20px;border-radius:6px;border-left:4px solid #1a237e;margin:24px 0"><p style="margin:0;color:#1a237e;font-weight:bold">What happens next?</p><p style="margin:10px 0 0;color:#424242">1. Our admin team will review your KYC documents.</p><p style="margin:6px 0 0;color:#424242">2. Once approved, you will receive a confirmation email with your Customer ID.</p><p style="margin:6px 0 0;color:#424242">3. You can then login and request a bank account to start banking.</p></div><p style="color:#757575;font-size:13px">This process typically takes 1 to 2 business days.</p></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">This is an automated message from MyFin Bank. Please do not reply.</p><p style="color:#9e9e9e;font-size:12px;margin:4px 0 0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Welcome email error:', e.message); }
};

const sendCustomerApprovedEmail = async (email, name, customerId) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Your MyFin Bank Account Has Been Activated',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#2e7d32">Congratulations, ${name}!</h2><p style="color:#424242;line-height:1.8">Your KYC verification has been completed. Your MyFin Bank account is now active.</p><div style="background:#e8f5e9;padding:20px;border-radius:6px;border-left:4px solid #2e7d32;margin:24px 0"><p style="margin:0;color:#1b5e20;font-weight:bold">Your Account Details</p><p style="margin:12px 0 0;color:#1b5e20"><strong>Customer ID:</strong> ${customerId}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Status:</strong> Active</p><p style="margin:12px 0 0;color:#424242;font-size:13px">Save your Customer ID. You can use your email or Customer ID to login.</p></div></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Customer approved email error:', e.message); }
};

const sendAccountApprovedEmail = async (email, name, accountNumber, accountType) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Your Bank Account Has Been Opened — MyFin Bank',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#2e7d32">Dear ${name}, Your Bank Account Is Ready!</h2><div style="background:#e8f5e9;padding:20px;border-radius:6px;border-left:4px solid #2e7d32;margin:24px 0"><p style="margin:0;color:#1b5e20;font-weight:bold">Account Details</p><p style="margin:12px 0 0;color:#1b5e20"><strong>Account Number:</strong> ${accountNumber}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Account Type:</strong> ${accountType}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Opening Balance:</strong> ₹0.00</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Status:</strong> Active</p><p style="margin:8px 0 0;color:#757575;font-size:13px"><strong>Date Opened:</strong> ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p></div></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Account approved email error:', e.message); }
};

const sendTransferInitiatedEmail = async (email, name, amount, fromAccount, toAccount, txnId) => {
  try {
    const expectedTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleString('en-IN');
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Fund Transfer Initiated — MyFin Bank',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#e65100">Dear ${name}, Your Transfer Has Been Initiated</h2><p style="color:#424242">The amount will be credited to the receiver within 15 minutes.</p><div style="background:#fff3e0;padding:20px;border-radius:6px;border-left:4px solid #e65100;margin:24px 0"><p style="margin:0;color:#e65100;font-weight:bold">Transfer Details</p><p style="margin:12px 0 0;color:#e65100"><strong>Transaction ID:</strong> ${txnId}</p><p style="margin:8px 0 0;color:#e65100"><strong>From:</strong> ${fromAccount}</p><p style="margin:8px 0 0;color:#e65100"><strong>To:</strong> ${toAccount}</p><p style="margin:8px 0 0;color:#e65100"><strong>Amount:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p><p style="margin:8px 0 0;color:#e65100"><strong>Status:</strong> Processing</p><p style="margin:8px 0 0;color:#757575;font-size:13px"><strong>Expected Credit By:</strong> ${expectedTime}</p></div></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Transfer initiated email error:', e.message); }
};

const sendTransferReceivedEmail = async (email, name, amount, fromAccount, toAccount, balanceAfter, txnId) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Amount Credited to Your Account — MyFin Bank',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#2e7d32">Dear ${name}, Amount Credited!</h2><div style="background:#e8f5e9;padding:20px;border-radius:6px;border-left:4px solid #2e7d32;margin:24px 0"><p style="margin:0;color:#1b5e20;font-weight:bold">Transaction Details</p><p style="margin:12px 0 0;color:#1b5e20"><strong>Transaction ID:</strong> ${txnId}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>From:</strong> ${fromAccount}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>To:</strong> ${toAccount}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Amount Credited:</strong> ₹${Number(amount).toLocaleString('en-IN')}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Available Balance:</strong> ₹${Number(balanceAfter).toLocaleString('en-IN')}</p><p style="margin:8px 0 0;color:#757575;font-size:13px"><strong>Credited At:</strong> ${new Date().toLocaleString('en-IN')}</p></div></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Transfer received email error:', e.message); }
};

const sendLoanApprovedEmail = async (email, name, loanId, loanAmount, interestRate, emiAmount, tenureMonths) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Your Loan Has Been Approved — MyFin Bank',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#2e7d32">Dear ${name}, Your Loan Has Been Approved</h2><div style="background:#e8f5e9;padding:20px;border-radius:6px;border-left:4px solid #2e7d32;margin:24px 0"><p style="margin:0;color:#1b5e20;font-weight:bold">Loan Details</p><p style="margin:12px 0 0;color:#1b5e20"><strong>Loan ID:</strong> ${loanId}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Amount:</strong> ₹${Number(loanAmount).toLocaleString('en-IN')}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Interest Rate:</strong> ${interestRate}% p.a.</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Monthly EMI:</strong> ₹${Number(emiAmount).toLocaleString('en-IN')}</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Tenure:</strong> ${tenureMonths} months</p><p style="margin:8px 0 0;color:#1b5e20"><strong>Total Payable:</strong> ₹${(Number(emiAmount)*tenureMonths).toLocaleString('en-IN')}</p></div></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Loan approved email error:', e.message); }
};

const sendLoanRejectedEmail = async (email, name, loanId, loanAmount) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Update on Your Loan Application — MyFin Bank',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#b71c1c">Dear ${name}, Update on Your Loan Application</h2><p style="color:#424242;line-height:1.8">After careful review, we regret to inform you that we are unable to approve your loan request at this time.</p><div style="background:#ffebee;padding:20px;border-radius:6px;border-left:4px solid #b71c1c;margin:24px 0"><p style="margin:0;color:#b71c1c;font-weight:bold">Application Details</p><p style="margin:12px 0 0;color:#b71c1c"><strong>Loan ID:</strong> ${loanId}</p><p style="margin:8px 0 0;color:#b71c1c"><strong>Requested Amount:</strong> ₹${Number(loanAmount).toLocaleString('en-IN')}</p><p style="margin:8px 0 0;color:#b71c1c"><strong>Status:</strong> Not Approved</p></div></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Loan rejected email error:', e.message); }
};

const sendZeroBalanceAlert = async (customerName, accountNumber) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: process.env.ADMIN_EMAIL,
      subject: 'Alert: Customer Account Balance Has Reached Zero — MyFin Bank',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#b71c1c;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank — Admin Alert</h1></div><div style="padding:32px"><h2 style="color:#b71c1c">Account Balance Alert</h2><div style="background:#ffebee;padding:20px;border-radius:6px;border-left:4px solid #b71c1c;margin:24px 0"><p style="margin:0;color:#b71c1c;font-weight:bold">Account Details</p><p style="margin:12px 0 0;color:#b71c1c"><strong>Customer Name:</strong> ${customerName}</p><p style="margin:8px 0 0;color:#b71c1c"><strong>Account Number:</strong> ${accountNumber}</p><p style="margin:8px 0 0;color:#b71c1c"><strong>Current Balance:</strong> ₹0.00</p><p style="margin:8px 0 0;color:#757575;font-size:13px"><strong>Alert Time:</strong> ${new Date().toLocaleString('en-IN')}</p></div><p style="color:#424242">The account has been marked AT_RISK. If balance is not restored within 24 hours, it will be automatically deactivated.</p></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('Zero balance alert error:', e.message); }
};

const sendOTPEmail = async (email, otp) => {
  try {
    await createTransporter().sendMail({
      from: `"MyFin Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: 'Password Reset Request — MyFin Bank',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden"><div style="background:#1a237e;padding:24px;text-align:center"><h1 style="color:white;margin:0">MyFin Bank</h1></div><div style="padding:32px"><h2 style="color:#1a237e">Password Reset Request</h2><p style="color:#424242;line-height:1.8">Please use the OTP below to complete your password reset.</p><div style="text-align:center;margin:32px 0"><div style="display:inline-block;background:#e8eaf6;padding:24px 48px;border-radius:8px;border:2px dashed #1a237e"><p style="margin:0;color:#757575;font-size:13px;margin-bottom:8px">Your One Time Password</p><h1 style="color:#1a237e;font-size:48px;margin:0;letter-spacing:10px;font-family:Consolas,monospace">${otp}</h1></div></div><p style="color:#b71c1c;text-align:center;font-weight:bold">This OTP is valid for 10 minutes only and can be used once.</p></div><div style="background:#f5f5f5;padding:16px;text-align:center"><p style="color:#9e9e9e;font-size:12px;margin:0">© 2026 MyFin Bank. All rights reserved.</p></div></div>`
    });
  } catch (e) { console.log('OTP email error:', e.message); }
};

module.exports = {
  sendWelcomeEmail, sendCustomerApprovedEmail, sendAccountApprovedEmail,
  sendTransferInitiatedEmail, sendTransferReceivedEmail,
  sendLoanApprovedEmail, sendLoanRejectedEmail, sendZeroBalanceAlert, sendOTPEmail
};
