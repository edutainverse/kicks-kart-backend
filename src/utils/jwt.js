import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccess(payload, ttlMin = env.ACCESS_TOKEN_TTL_MIN) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: `${ttlMin}m` });
}

export function signRefresh(payload, ttlDays = env.REFRESH_TOKEN_TTL_DAYS) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: `${ttlDays}d` });
}

export function verifyAccess(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefresh(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
