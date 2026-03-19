const Account = require('../models/Account');
const Customer = require('../models/Customer');
const generateId = require('../utils/idGenerator');
const { sendAccountApprovedEmail } = require('./emailService');

const createAccount = async (customerId, accountType) => {
  const existing = await Account.findOne({ customerId, accountType });
  if (existing) throw new Error(`Customer already has a ${accountType} account`);

  const prefix = accountType === 'SAVINGS' ? 'MYFIN-SACC' : 'MYFIN-CACC';
  const accountNumber = await generateId(Account, 'accountNumber', prefix);

  const account = new Account({ accountNumber, customerId, accountType });
  await account.save();
  return account;
};

const getAccountsByCustomer = async (customerId) => {
  return await Account.find({ customerId });
};

const getAccountByNumber = async (accountNumber) => {
  return await Account.findOne({ accountNumber });
};

const updateAccountStatus = async (accountNumber, status, deactivationType = null) => {
  const updateData = { status };
  if (deactivationType) updateData.deactivationType = deactivationType;
  if (status === 'AT_RISK') updateData.atRiskSince = new Date();
  if (status === 'ACTIVE') {
    updateData.atRiskSince = null;
    updateData.deactivationType = null;
  }

  const account = await Account.findOneAndUpdate(
    { accountNumber },
    updateData,
    { new: true }
  );

  // Send email only when admin approves account
  if (status === 'ACTIVE' && account) {
    try {
      const customer = await Customer.findOne({ customerId: account.customerId });
      if (customer) {
        await sendAccountApprovedEmail(
          customer.email,
          customer.name,
          accountNumber,
          account.accountType
        );
      }
    } catch (err) {
      console.log('Account approved email failed:', err.message);
    }
  }

  return account;
};

const getAllPendingAccounts = async () => {
  return await Account.find({ status: 'REQUESTED' });
};

const getAllAccounts = async () => {
  return await Account.find({});
};

module.exports = {
  createAccount,
  getAccountsByCustomer,
  getAccountByNumber,
  updateAccountStatus,
  getAllPendingAccounts,
  getAllAccounts
};