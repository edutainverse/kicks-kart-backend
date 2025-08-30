import rateLimit from 'express-rate-limit';
import { env } from './env.js';

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: env.NODE_ENV === 'production' ? 20 : 1000, // Very high limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_AUTH_REQUESTS',
      message: 'Too many authentication attempts, please try again later.'
    }
  }
});

export default authLimiter;
