import User from '../users/user.model.js';
import { hashPassword, comparePassword } from '../../utils/crypto.js';
import { signAccess, signRefresh, verifyRefresh } from '../../utils/jwt.js';
import { env } from '../../config/env.js';
import { sendMail } from '../../utils/mailer.js';
import { welcomeEmailTemplate } from '../../utils/emailTemplates.js';

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
  // Send welcome email
  try {
    const { html, trackingId } = welcomeEmailTemplate(name);
    await sendMail({
      to: email,
      subject: 'Welcome to KicksKart!',
      html,
      trackingId,
      emailType: 'welcome',
      userId: user._id,
      metadata: { name }
    });
  } catch (e) {
    // Log but don't block signup
    console.error('Failed to send welcome email:', e);
  }
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
  
  // Give admin users longer token duration (24 hours instead of 15 minutes)
  const accessTokenTTL = user.role === 'admin' ? 1440 : env.ACCESS_TOKEN_TTL_MIN; // 1440 minutes = 24 hours
  const accessToken = signAccess(payload, accessTokenTTL);
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
    
    // Give admin users longer token duration (24 hours instead of 15 minutes)
    const accessTokenTTL = payload.role === 'admin' ? 1440 : env.ACCESS_TOKEN_TTL_MIN; // 1440 minutes = 24 hours
    const accessToken = signAccess({ sub: payload.sub, role: payload.role, name: payload.name, email: payload.email }, accessTokenTTL);
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
