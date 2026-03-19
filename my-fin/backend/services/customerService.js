const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const generateId = require('../utils/idGenerator');
const { sendWelcomeEmail, sendCustomerApprovedEmail } = require('./emailService');

const registerCustomer = async (data, filePath) => {
  const existing = await Customer.findOne({ email: data.email });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const customerId = await generateId(Customer, 'customerId', 'MYFIN-CUST');

  const customer = new Customer({
    customerId, name: data.name, email: data.email,
    password: hashedPassword, phone: data.phone, address: data.address,
    govIdType: data.govIdType, govIdNumber: data.govIdNumber, govIdDocumentPath: filePath
  });

  await customer.save();

  // Send welcome email to customer's own registered email
  try { await sendWelcomeEmail(data.email, data.name); } catch (e) { console.log('Welcome email failed:', e.message); }

  return customer;
};

const loginCustomer = async (emailOrId, password) => {
  const customer = await Customer.findOne({ $or: [{ email: emailOrId }, { customerId: emailOrId }] });
  if (!customer) throw new Error('Customer not found');
  if (customer.status !== 'ACTIVE') throw new Error('Account not active. Awaiting admin approval.');
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) throw new Error('Invalid password');
  return customer;
};

const getAllCustomers = async () => await Customer.find({}, { password: 0 });

const getCustomerById = async (customerId) => await Customer.findOne({ customerId }, { password: 0 });

const updateCustomerStatus = async (customerId, status) => {
  const customer = await Customer.findOneAndUpdate({ customerId }, { status }, { new: true });
  if (status === 'ACTIVE' && customer) {
    try { await sendCustomerApprovedEmail(customer.email, customer.name, customer.customerId); }
    catch (e) { console.log('Customer approved email failed:', e.message); }
  }
  return customer;
};

const updateCustomer = async (customerId, data) =>
  await Customer.findOneAndUpdate({ customerId }, { name: data.name, phone: data.phone, address: data.address }, { new: true });

module.exports = { registerCustomer, loginCustomer, getAllCustomers, getCustomerById, updateCustomerStatus, updateCustomer };
