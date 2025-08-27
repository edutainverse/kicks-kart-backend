import request from 'supertest';
import app from '../../app.js';
import { loadEnv, env } from '../../config/env.js';
import { connect } from '../../db/connect.js';
import mongoose from 'mongoose';

describe('Auth', () => {
  beforeAll(async () => {
    loadEnv();
    await connect(env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('signup -> login -> refresh -> me', async () => {
    const email = 'test@example.com';
    await request(app).post('/api/auth/signup').send({ name: 'Test', email, password: 'Password@123' }).expect(201);

    const login = await request(app).post('/api/auth/login').send({ email, password: 'Password@123' }).expect(200);
    expect(login.body.accessToken).toBeTruthy();
    const cookies = login.headers['set-cookie'];
    expect(cookies.join(';')).toContain('refresh_token');

    const refresh = await request(app).post('/api/auth/refresh').set('Cookie', cookies).send({}).expect(200);
    expect(refresh.body.accessToken).toBeTruthy();

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${refresh.body.accessToken}`).expect(200);
    expect(me.body.email).toBe(email);
  });

  it('rejects bad creds', async () => {
    await request(app).post('/api/auth/login').send({ email: 'no@user.com', password: 'x' }).expect(401);
  });
});
