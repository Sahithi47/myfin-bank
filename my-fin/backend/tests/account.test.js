const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });
const app = require('../server');

let customerToken = '', adminToken = '', accountNumber = '', customerId = '';

describe('Account Management Tests', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.collection('customers').deleteMany({ email: 'accounttest@gmail.com' });
    await mongoose.connection.collection('admins').deleteMany({ email: 'admintest@myfin.com' });

    const regRes = await request(app).post('/api/customers/register')
      .field('name', 'Account Test').field('email', 'accounttest@gmail.com')
      .field('password', 'Test@123').field('phone', '9876543210')
      .field('address', 'Test Address').field('govIdType', 'AADHAAR').field('govIdNumber', '9999-8888-7777');
    customerId = regRes.body.customerId;

    await mongoose.connection.collection('customers').updateOne({ email: 'accounttest@gmail.com' }, { $set: { status: 'ACTIVE' } });

    const loginRes = await request(app).post('/api/customers/login').send({ email: 'accounttest@gmail.com', password: 'Test@123' });
    customerToken = loginRes.body.token;

    await request(app).post('/api/admin/register').send({ name: 'Test Admin', email: 'admintest@myfin.com', password: 'Admin@123' });
    const adminLogin = await request(app).post('/api/admin/login').send({ email: 'admintest@myfin.com', password: 'Admin@123' });
    adminToken = adminLogin.body.token;
  });

  after(async () => {
    await mongoose.connection.collection('customers').deleteMany({ email: 'accounttest@gmail.com' });
    await mongoose.connection.collection('admins').deleteMany({ email: 'admintest@myfin.com' });
    if (accountNumber) await mongoose.connection.collection('accounts').deleteMany({ customerId });
  });

  it('11. Should request a savings account', async () => {
    const res = await request(app).post('/api/accounts').set('Authorization', `Bearer ${customerToken}`).send({ customerId, accountType: 'SAVINGS' });
    expect(res.status).to.equal(201);
    expect(res.body.account).to.have.property('accountNumber');
    expect(res.body.account.status).to.equal('REQUESTED');
    accountNumber = res.body.account.accountNumber;
  });

  it('12. Should not request same account type twice', async () => {
    const res = await request(app).post('/api/accounts').set('Authorization', `Bearer ${customerToken}`).send({ customerId, accountType: 'SAVINGS' });
    expect(res.status).to.equal(400);
  });

  it('13. Should get pending accounts as admin', async () => {
    const res = await request(app).get('/api/accounts/pending').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('14. Should approve account as admin', async () => {
    const res = await request(app).put(`/api/accounts/${accountNumber}/status`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'ACTIVE' });
    expect(res.status).to.equal(200);
    expect(res.body.account.status).to.equal('ACTIVE');
  });

  it('15. Should get my accounts as customer', async () => {
    const res = await request(app).get('/api/accounts/my').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
  });

  it('16. Should deposit money as admin', async () => {
    const res = await request(app).post('/api/transactions/deposit').set('Authorization', `Bearer ${adminToken}`).send({ accountNumber, amount: 50000, description: 'Test Deposit' });
    expect(res.status).to.equal(200);
    expect(res.body.transaction.type).to.equal('CREDIT');
  });

  it('17. Should not deposit with customer token', async () => {
    const res = await request(app).post('/api/transactions/deposit').set('Authorization', `Bearer ${customerToken}`).send({ accountNumber, amount: 1000 });
    expect(res.status).to.equal(403);
  });

  it('18. Should withdraw money as customer', async () => {
    const res = await request(app).post('/api/transactions/withdraw').set('Authorization', `Bearer ${customerToken}`).send({ accountNumber, amount: 5000, description: 'Test Withdrawal' });
    expect(res.status).to.equal(200);
    expect(res.body.transaction.type).to.equal('DEBIT');
  });

  it('19. Should not withdraw more than balance', async () => {
    const res = await request(app).post('/api/transactions/withdraw').set('Authorization', `Bearer ${customerToken}`).send({ accountNumber, amount: 999999 });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Insufficient balance');
  });

  it('20. Should deactivate account as admin', async () => {
    const res = await request(app).put(`/api/accounts/${accountNumber}/status`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'DEACTIVATED', deactivationType: 'MANUAL' });
    expect(res.status).to.equal(200);
  });
});
