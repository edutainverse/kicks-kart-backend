import request from 'supertest';
import app from '../../app.js';
import { loadEnv, env } from '../../config/env.js';
import { connect } from '../../db/connect.js';
import mongoose from 'mongoose';

describe('Orders + Payments', () => {
  let authToken; let cookies;
  let productId; let orderId; let clientSecret; let paymentIntentId;

  beforeAll(async () => {
    loadEnv();
    await connect(env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();
    // signup/login
    const email = 'user@u.com';
    await request(app).post('/api/auth/signup').send({ name: 'User', email, password: 'Password@123' });
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Password@123' });
    authToken = login.body.accessToken; cookies = login.headers['set-cookie'];
  });

  afterAll(async () => { await mongoose.disconnect(); });

  it('admin creates product + inventory', async () => {
    // create admin
    await request(app).post('/api/auth/signup').send({ name: 'Admin', email: 'admin@a.com', password: 'Admin@1234' });
    // patch user to admin directly in DB
    const User = (await import('../users/user.model.js')).default;
    await User.updateOne({ email: 'admin@a.com' }, { $set: { role: 'admin' } });
    // admin login
    const adminLogin = await request(app).post('/api/auth/login').send({ email: 'admin@a.com', password: 'Admin@1234' });
    const adminToken = adminLogin.body.accessToken;

    const prod = await request(app).post('/api/admin/products').set('Authorization', `Bearer ${adminToken}`).send({ slug: 'nike-air', title: 'Nike Air', price: 1999, images: [], sizes: ['9','10'], category: 'running' }).expect(201);
    productId = prod.body._id;
    await request(app).patch(`/api/admin/inventory/${productId}`).set('Authorization', `Bearer ${adminToken}`).send({ variants: [{ size: '9', stock: 10 }, { size: '10', stock: 5 }] }).expect(200);
  });

  it('user adds to cart and checkout', async () => {
    await request(app).post('/api/cart/items').set('Authorization', `Bearer ${authToken}`).send({ productId, size: '9', qty: 2 }).expect(200);
    const co = await request(app).post('/api/cart/checkout').set('Authorization', `Bearer ${authToken}`).send({}).expect(201);
    orderId = co.body.orderId; clientSecret = co.body.clientSecret; expect(orderId && clientSecret).toBeTruthy();
    // find payment intent by clientSecret
    const PaymentIntent = (await import('../payments/paymentIntent.model.js')).default;
    const pi = await PaymentIntent.findOne({ clientSecret }).lean();
    paymentIntentId = pi._id.toString();
  });

  it('webhook success updates order and decrements stock, replay ignored', async () => {
    const payload = { paymentIntentId, outcome: 'succeeded' };
    const raw = JSON.stringify(payload);
    // Compute signature the same way as service: HMAC hex of raw body
    const crypto = await import('crypto');
    const sig = crypto.createHmac('sha256', env.FAKEPAY_WEBHOOK_SECRET).update(Buffer.from(raw)).digest('hex');
    const header = `t=${Date.now()},sig=${sig}`;
    await request(app).post('/api/payments/webhook').set('x-fp-signature', header).send(payload).expect(200);

    const Order = (await import('./order.model.js')).default;
    const o = await Order.findById(orderId).lean();
    expect(o.status).toBe('paid');

    // replay
    const r = await request(app).post('/api/payments/webhook').set('x-fp-signature', header).send(payload).expect(200);
    expect(r.body.received).toBe(true);
  });
});
