const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });
const app = require('../server');

let customerToken = '', adminToken = '', accountNumber1 = '', accountNumber2 = '', customerId1 = '', customerId2 = '';

describe('Transaction Tests', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.collection('customers').deleteMany({ email: { $in: ['txntest1@gmail.com', 'txntest2@gmail.com'] } });
    await mongoose.connection.collection('admins').deleteMany({ email: 'txnadmin@myfin.com' });

    await request(app).post('/api/admin/register').send({ name: 'TxnAdmin', email: 'txnadmin@myfin.com', password: 'Admin@123' });
    const adminLogin = await request(app).post('/api/admin/login').send({ email: 'txnadmin@myfin.com', password: 'Admin@123' });
    adminToken = adminLogin.body.token;

    const reg1 = await request(app).post('/api/customers/register')
      .field('name', 'TxnTest1').field('email', 'txntest1@gmail.com').field('password', 'Test@123')
      .field('phone', '9876543210').field('address', 'Hyderabad').field('govIdType', 'AADHAAR').field('govIdNumber', '1111-2222-3333');
    customerId1 = reg1.body.customerId;

    const reg2 = await request(app).post('/api/customers/register')
      .field('name', 'TxnTest2').field('email', 'txntest2@gmail.com').field('password', 'Test@123')
      .field('phone', '8888888888').field('address', 'Chennai').field('govIdType', 'PAN').field('govIdNumber', 'ABCDE1234F');
    customerId2 = reg2.body.customerId;

    await mongoose.connection.collection('customers').updateMany({ email: { $in: ['txntest1@gmail.com', 'txntest2@gmail.com'] } }, { $set: { status: 'ACTIVE' } });

    const login1 = await request(app).post('/api/customers/login').send({ email: 'txntest1@gmail.com', password: 'Test@123' });
    customerToken = login1.body.token;
    const login2 = await request(app).post('/api/customers/login').send({ email: 'txntest2@gmail.com', password: 'Test@123' });
    const customer2Token = login2.body.token;

    const acc1 = await request(app).post('/api/accounts').set('Authorization', `Bearer ${customerToken}`).send({ customerId: customerId1, accountType: 'SAVINGS' });
    accountNumber1 = acc1.body.account.accountNumber;
    await request(app).put(`/api/accounts/${accountNumber1}/status`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'ACTIVE' });

    const acc2 = await request(app).post('/api/accounts').set('Authorization', `Bearer ${customer2Token}`).send({ customerId: customerId2, accountType: 'SAVINGS' });
    accountNumber2 = acc2.body.account.accountNumber;
    await request(app).put(`/api/accounts/${accountNumber2}/status`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'ACTIVE' });

    await request(app).post('/api/transactions/deposit').set('Authorization', `Bearer ${adminToken}`).send({ accountNumber: accountNumber1, amount: 100000, description: 'Initial' });
  });

  after(async () => {
    await mongoose.connection.collection('customers').deleteMany({ email: { $in: ['txntest1@gmail.com', 'txntest2@gmail.com'] } });
    await mongoose.connection.collection('admins').deleteMany({ email: 'txnadmin@myfin.com' });
    await mongoose.connection.collection('accounts').deleteMany({ customerId: { $in: [customerId1, customerId2] } });
  });

  it('21. Should transfer money between accounts', async () => {
    const res = await request(app).post('/api/transactions/transfer').set('Authorization', `Bearer ${customerToken}`)
      .send({ fromAccountNumber: accountNumber1, toAccountNumber: accountNumber2, amount: 10000, description: 'Test Transfer' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('referenceId');
    expect(res.body.debitTxn.type).to.equal('DEBIT');
  });

  it('22. Should not transfer more than balance', async () => {
    const res = await request(app).post('/api/transactions/transfer').set('Authorization', `Bearer ${customerToken}`)
      .send({ fromAccountNumber: accountNumber1, toAccountNumber: accountNumber2, amount: 9999999 });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Insufficient balance');
  });

  it('23. Should not transfer to same account', async () => {
    const res = await request(app).post('/api/transactions/transfer').set('Authorization', `Bearer ${customerToken}`)
      .send({ fromAccountNumber: accountNumber1, toAccountNumber: accountNumber1, amount: 1000 });
    expect(res.status).to.equal(400);
  });

  it('24. Should get passbook for account', async () => {
    const res = await request(app).get(`/api/transactions/passbook/${accountNumber1}`).set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
  });

  it('25. Should calculate EMI correctly', async () => {
    const res = await request(app).post('/api/loans/calculate-emi').send({ loanAmount: 100000, interestRate: 8, tenureMonths: 12 });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('emi');
    expect(res.body.emi).to.be.a('number');
    expect(res.body.emi).to.be.greaterThan(0);
  });

  it('26. Should apply for a loan', async () => {
    const res = await request(app).post('/api/loans/apply').set('Authorization', `Bearer ${customerToken}`)
      .send({ accountNumber: accountNumber1, loanAmount: 50000, tenureMonths: 12, purpose: 'Personal Loan' });
    expect(res.status).to.equal(201);
    expect(res.body.loan).to.have.property('loanId');
    expect(res.body.loan.status).to.equal('PENDING');
  });

  it('27. Should create Fixed Deposit', async () => {
    const res = await request(app).post('/api/fd').set('Authorization', `Bearer ${customerToken}`)
      .send({ accountNumber: accountNumber1, amount: 10000, interestRate: 7, tenureMonths: 12 });
    expect(res.status).to.equal(201);
    expect(res.body.fd).to.have.property('fdId');
    expect(res.body.fd.maturityAmount).to.be.greaterThan(10000);
  });

  it('28. Should create Recurring Deposit', async () => {
    const res = await request(app).post('/api/rd').set('Authorization', `Bearer ${customerToken}`)
      .send({ accountNumber: accountNumber1, monthlyAmount: 2000, tenureMonths: 12, interestRate: 6 });
    expect(res.status).to.equal(201);
    expect(res.body.rd).to.have.property('rdId');
    expect(res.body.rd.paidInstallments).to.equal(1);
  });

  it('29. Should not withdraw from inactive account', async () => {
    await mongoose.connection.collection('accounts').updateOne({ accountNumber: accountNumber2 }, { $set: { status: 'DEACTIVATED' } });
    const login2 = await request(app).post('/api/customers/login').send({ email: 'txntest2@gmail.com', password: 'Test@123' });
    const res = await request(app).post('/api/transactions/withdraw').set('Authorization', `Bearer ${login2.body.token}`)
      .send({ accountNumber: accountNumber2, amount: 1000 });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Account not active');
  });

  it('30. Should get all accounts as admin', async () => {
    const res = await request(app).get('/api/accounts/all').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
