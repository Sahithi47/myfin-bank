const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Customer = require('../models/Customer');
const generateId = require('../utils/idGenerator');
const { sendZeroBalanceAlert, sendTransferInitiatedEmail, sendTransferReceivedEmail } = require('./emailService');

const generateTxnId = async () => await generateId(Transaction, 'txnId', 'MYFIN-TXN', 6);

const deposit = async (accountNumber, amount, description = 'Deposit') => {
  const account = await Account.findOne({ accountNumber });
  if (!account || account.status !== 'ACTIVE') throw new Error('Account not active');
  const newBalance = account.balance + amount;
  account.balance = newBalance;
  await account.save();
  const txnId = await generateTxnId();
  const txn = new Transaction({ txnId, accountNumber, transactionCategory: 'DEPOSIT', type: 'CREDIT', amount, balanceAfterTxn: newBalance, description });
  await txn.save();
  return txn;
};

const withdraw = async (accountNumber, amount, description = 'Withdrawal') => {
  const account = await Account.findOne({ accountNumber });
  if (!account || account.status !== 'ACTIVE') throw new Error('Account not active');
  if (account.balance < amount) throw new Error('Insufficient balance');
  const newBalance = account.balance - amount;
  account.balance = newBalance;
  if (newBalance === 0) {
    account.status = 'AT_RISK';
    account.atRiskSince = new Date();
    try { const c = await Customer.findOne({ customerId: account.customerId }); if (c) await sendZeroBalanceAlert(c.name, accountNumber); }
    catch (e) { console.log('Zero balance alert failed:', e.message); }
  }
  await account.save();
  const txnId = await generateTxnId();
  const txn = new Transaction({ txnId, accountNumber, transactionCategory: 'WITHDRAW', type: 'DEBIT', amount, balanceAfterTxn: newBalance, description });
  await txn.save();
  return txn;
};

const transfer = async (fromAccountNumber, toAccountNumber, amount, description = 'Fund Transfer') => {
  const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
  const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
  if (!fromAccount || fromAccount.status !== 'ACTIVE') throw new Error('Sender account not active');
  if (!toAccount || toAccount.status !== 'ACTIVE') throw new Error('Receiver account not active');
  if (fromAccount.balance < amount) throw new Error('Insufficient balance');
  if (fromAccountNumber === toAccountNumber) throw new Error('Cannot transfer to same account');

  const fromNewBalance = fromAccount.balance - amount;
  fromAccount.balance = fromNewBalance;
  if (fromNewBalance === 0) {
    fromAccount.status = 'AT_RISK'; fromAccount.atRiskSince = new Date();
    try { const c = await Customer.findOne({ customerId: fromAccount.customerId }); if (c) await sendZeroBalanceAlert(c.name, fromAccountNumber); }
    catch (e) { console.log('Zero balance alert failed:', e.message); }
  }
  await fromAccount.save();

  const { v4: uuidv4 } = require('uuid');
  const referenceId = `REF-${uuidv4().split('-')[0].toUpperCase()}`;
  const txnId1 = await generateTxnId();
  const txnId2 = await generateTxnId();

  const debitTxn = new Transaction({ txnId: txnId1, accountNumber: fromAccountNumber, referenceId, transactionCategory: 'TRANSFER', type: 'DEBIT', amount, balanceAfterTxn: fromNewBalance, description: `Transfer to ${toAccountNumber}` });
  await debitTxn.save();

  try {
    const fromCustomer = await Customer.findOne({ customerId: fromAccount.customerId });
    if (fromCustomer) await sendTransferInitiatedEmail(fromCustomer.email, fromCustomer.name, amount, fromAccountNumber, toAccountNumber, txnId1);
  } catch (e) { console.log('Transfer initiated email failed:', e.message); }

  // Delay 15 minutes before crediting receiver
  setTimeout(async () => {
    try {
      const receiverAccount = await Account.findOne({ accountNumber: toAccountNumber });
      if (!receiverAccount) return;
      const toNewBalance = receiverAccount.balance + amount;
      receiverAccount.balance = toNewBalance;
      await receiverAccount.save();
      const creditTxn = new Transaction({ txnId: txnId2, accountNumber: toAccountNumber, referenceId, transactionCategory: 'TRANSFER', type: 'CREDIT', amount, balanceAfterTxn: toNewBalance, description: `Transfer from ${fromAccountNumber}` });
      await creditTxn.save();
      const toCustomer = await Customer.findOne({ customerId: receiverAccount.customerId });
      if (toCustomer) await sendTransferReceivedEmail(toCustomer.email, toCustomer.name, amount, fromAccountNumber, toAccountNumber, toNewBalance, txnId2);
    } catch (e) { console.log('Delayed transfer credit failed:', e.message); }
  }, 15 * 60 * 1000);

  return { debitTxn, referenceId };
};

const getTransactionsByAccount = async (accountNumber) =>
  await Transaction.find({ accountNumber }).sort({ date: -1 });

module.exports = { deposit, withdraw, transfer, getTransactionsByAccount };
