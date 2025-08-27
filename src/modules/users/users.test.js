import request from 'supertest';
import app from '../../app.js';
import { loadEnv, env } from '../../config/env.js';
import { connect } from '../../db/connect.js';
import mongoose from 'mongoose';

describe('Admin guarding', () => {
  let userToken; let adminToken;
  beforeAll(async () => {
    loadEnv();
    await connect(env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();
    // create user
    await request(app).post('/api/auth/signup').send({ name: 'U', email: 'u@u.com', password: 'Password@123' });
    const uLogin = await request(app).post('/api/auth/login').send({ email: 'u@u.com', password: 'Password@123' });
    userToken = uLogin.body.accessToken;
    // create admin
    await request(app).post('/api/auth/signup').send({ name: 'A', email: 'a@a.com', password: 'Admin@1234' });
    const User = (await import('./user.model.js')).default;
    await User.updateOne({ email: 'a@a.com' }, { $set: { role: 'admin' } });
    const aLogin = await request(app).post('/api/auth/login').send({ email: 'a@a.com', password: 'Admin@1234' });
    adminToken = aLogin.body.accessToken;
  });

  afterAll(async () => { await mongoose.disconnect(); });

  it('non-admin forbidden', async () => {
    await request(app).get('/api/admin/users').set('Authorization', `Bearer ${userToken}`).expect(403);
  });

  it('admin can list users', async () => {
    const r = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`).expect(200);
    expect(Array.isArray(r.body)).toBe(true);
  });
});
