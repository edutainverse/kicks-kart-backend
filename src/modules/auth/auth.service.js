import User from '../users/user.model.js';
import { hashPassword, comparePassword } from '../../utils/crypto.js';
import { signAccess, signRefresh, verifyRefresh } from '../../utils/jwt.js';
import { env } from '../../config/env.js';

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.COOKIE_SECURE,
    path: '/api/auth/refresh',
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
}

export async function signup({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error('Email already registered');
    err.status = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role: 'user' });
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
}

export async function login({ email, password }, res) {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401, code: 'AUTH_ERROR' });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401, code: 'AUTH_ERROR' });

  const payload = { sub: user._id.toString(), role: user.role, name: user.name, email: user.email };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  res.cookie('refresh_token', refreshToken, cookieOptions());
  // Return profile along with token
  const profile = user.toObject();
  delete profile.passwordHash;
  return { accessToken, profile };
}

export async function refresh(req, res) {
  const token = req.cookies?.refresh_token;
  if (!token) throw Object.assign(new Error('Missing refresh token'), { status: 401, code: 'AUTH_ERROR' });
  try {
    const payload = verifyRefresh(token);
    const accessToken = signAccess({ sub: payload.sub, role: payload.role, name: payload.name, email: payload.email });
    return { accessToken };
  } catch {
    throw Object.assign(new Error('Invalid refresh token'), { status: 401, code: 'AUTH_ERROR' });
  }
}

export async function logout(_req, res) {
  res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
}

export async function me(userId) {
  const user = await User.findById(userId).lean();
  if (!user) throw Object.assign(new Error('User not found'), { status: 404, code: 'NOT_FOUND' });
  delete user.passwordHash;
  return user;
}
