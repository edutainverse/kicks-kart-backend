import { verifyAccess } from '../utils/jwt.js';

export function authGuard(req, _res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return next({ status: 401, code: 'AUTH_ERROR', message: 'Missing Bearer token' });
  try {
    const payload = verifyAccess(token);
    req.user = payload;
    next();
  } catch (e) {
    next({ status: 401, code: 'AUTH_ERROR', message: 'Invalid or expired token' });
  }
}
