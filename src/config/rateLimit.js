import rateLimit from 'express-rate-limit';
import { env } from './env.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'production' ? 500 : 10000, // Very high limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  skip: (req) => {
    // Skip rate limiting for development entirely on certain paths
    if (env.NODE_ENV === 'development' && (
      req.path.startsWith('/api/images') ||
      req.path.startsWith('/api/products') ||
      req.path.startsWith('/api/cart') ||
      req.path.startsWith('/api/wishlist')
    )) {
      return true;
    }
    return false;
  }
});

export default limiter;
