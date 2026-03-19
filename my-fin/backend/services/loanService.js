const Loan = require('../models/Loan');
const LoanPayment = require('../models/LoanPayment');
const Account = require('../models/Account');
const Customer = require('../models/Customer');
const generateId = require('../utils/idGenerator');
const {
  sendLoanApprovedEmail,
  sendLoanRejectedEmail
} = require('./emailService');

const suggestInterestRate = (loanAmount, tenureMonths) => {
  if (loanAmount <= 50000) return tenureMonths <= 12 ? 10 : 11;
  else if (loanAmount <= 200000) return tenureMonths <= 12 ? 9 : 9.5;
  else return tenureMonths <= 12 ? 8 : 8.5;
};

const calculateEMI = (principal, annualRate, tenureMonths) => {
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
};

const applyLoan = async (accountNumber, loanAmount, tenureMonths, purpose) => {
  const loanId = await generateId(Loan, 'loanId', 'MYFIN-LN');
  const suggestedRate = suggestInterestRate(loanAmount, tenureMonths);
  const emiAmount = calculateEMI(loanAmount, suggestedRate, tenureMonths);

  const loan = new Loan({
    loanId,
    accountNumber,
    loanAmount,
    interestRate: suggestedRate,
    tenureMonths,
    emiAmount,
    remainingBalance: loanAmount,
    purpose: purpose || 'Personal Loan',
  });

  await loan.save();
  return loan;
};

const getLoansByAccount = async (accountNumber) => {
  return await Loan.find({ accountNumber });
};

const getAllPendingLoans = async () => {
  return await Loan.find({ status: 'PENDING' });
};

const updateLoanStatus = async (loanId, status, adminInterestRate = null) => {
  const updateData = { status };

  if (status === 'ACTIVE') {
    updateData.startDate = new Date();
    if (adminInterestRate) {
      updateData.interestRate = adminInterestRate;
      const existingLoan = await Loan.findOne({ loanId });
      updateData.emiAmount = calculateEMI(
        existingLoan.loanAmount,
        adminInterestRate,
        existingLoan.tenureMonths
      );
    }
  }

  const loan = await Loan.findOneAndUpdate({ loanId }, updateData, { new: true });

  if (status === 'ACTIVE') {
    await LoanPayment.deleteMany({ loanId });
    for (let i = 1; i <= loan.tenureMonths; i++) {
      const paymentId = await generateId(LoanPayment, 'paymentId', 'MYFIN-PAY');
      const payment = new LoanPayment({
        paymentId,
        loanId,
        emiNumber: i,
        amount: loan.emiAmount,
        status: 'PENDING'
      });
      await payment.save();
    }
  }

  // Send email only for approved or rejected
  try {
    const account = await Account.findOne({ accountNumber: loan.accountNumber });
    const customer = await Customer.findOne({ customerId: account.customerId });
    if (customer) {
      if (status === 'ACTIVE') {
        await sendLoanApprovedEmail(
          customer.email, customer.name,
          loan.loanId, loan.loanAmount,
          loan.interestRate, loan.emiAmount, loan.tenureMonths
        );
      } else if (status === 'REJECTED') {
        await sendLoanRejectedEmail(
          customer.email, customer.name,
          loan.loanId, loan.loanAmount
        );
      }
    }
  } catch (err) {
    console.log('Loan email failed:', err.message);
  }

  return loan;
};

const getLoanPayments = async (loanId) => {
  return await LoanPayment.find({ loanId }).sort({ emiNumber: 1 });
};

module.exports = {
  suggestInterestRate,
  calculateEMI,
  applyLoan,
  getLoansByAccount,
  getAllPendingLoans,
  updateLoanStatus,
  getLoanPayments
};