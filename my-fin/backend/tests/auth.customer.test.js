const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });
const app = require('../server');

let customerToken = '';
let customerId = '';

describe('Customer Authentication Tests', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.collection('customers').deleteMany({ email: 'testcustomer@gmail.com' });
  });
  after(async () => {
    await mongoose.connection.collection('customers').deleteMany({ email: 'testcustomer@gmail.com' });
  });

  it('1. Should register a new customer successfully', async () => {
    const res = await request(app).post('/api/customers/register')
      .field('name', 'Test Customer').field('email', 'testcustomer@gmail.com')
      .field('password', 'Test@123').field('phone', '9876543210')
      .field('address', 'Hyderabad').field('govIdType', 'AADHAAR').field('govIdNumber', '1234-5678-9012');
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('customerId');
    customerId = res.body.customerId;
  });

  it('2. Should not register with duplicate email', async () => {
    const res = await request(app).post('/api/customers/register')
      .field('name', 'Test Customer').field('email', 'testcustomer@gmail.com')
      .field('password', 'Test@123').field('phone', '9876543210')
      .field('address', 'Hyderabad').field('govIdType', 'AADHAAR').field('govIdNumber', '1234-5678-9012');
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Email already registered');
  });

  it('3. Should not login before admin approval', async () => {
    const res = await request(app).post('/api/customers/login').send({ email: 'testcustomer@gmail.com', password: 'Test@123' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.include('not active');
  });

  it('4. Should not login with wrong password', async () => {
    await mongoose.connection.collection('customers').updateOne({ email: 'testcustomer@gmail.com' }, { $set: { status: 'ACTIVE' } });
    const res = await request(app).post('/api/customers/login').send({ email: 'testcustomer@gmail.com', password: 'WrongPassword' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Invalid password');
  });

  it('5. Should login successfully with email', async () => {
    const res = await request(app).post('/api/customers/login').send({ email: 'testcustomer@gmail.com', password: 'Test@123' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    customerToken = res.body.token;
  });

  it('6. Should login with Customer ID', async () => {
    const res = await request(app).post('/api/customers/login').send({ email: customerId, password: 'Test@123' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('7. Should not login with non-existent email', async () => {
    const res = await request(app).post('/api/customers/login').send({ email: 'notexist@gmail.com', password: 'Test@123' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Customer not found');
  });

  it('8. Should logout successfully', async () => {
    const res = await request(app).post('/api/customers/logout');
    expect(res.status).to.equal(200);
  });

  it('9. Should not access protected route without token', async () => {
    const res = await request(app).get('/api/accounts/my');
    expect(res.status).to.equal(401);
  });

  it('10. Should not access admin route with customer token', async () => {
    const res = await request(app).get('/api/customers/').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).to.equal(403);
  });
});
