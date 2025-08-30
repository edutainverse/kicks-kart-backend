import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from './config/rateLimit.js';
import { corsOptions } from './config/security.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { mongoHealthy } from './db/connect.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/products/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/orders/order.routes.js';
import paymentRoutes from './modules/payments/payments.routes.js';

import dashboardRoutes from './modules/dashboard/dashboard.routes.js';

import reviewRoutes from './modules/reviews/review.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import addressRoutes from './modules/address/address.routes.js';
import userRoutes from './modules/users/user.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import cacheRoutes from './modules/admin/cache.routes.js';
import emailAnalyticsRoutes from './modules/admin/emailAnalytics.routes.js';
import trackingRoutes from './routes/tracking.routes.js';

const app = express();

// Capture raw body for webhook verification
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid JSON format',
        details: []
      }
    });
  }
  next(err);
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(rateLimit);

// Static file serving for images with CORS support
const IMAGES_DIR = path.resolve(process.cwd(), 'public', 'images');

if (!fs.existsSync(IMAGES_DIR)) {
  console.log('Creating images directory:', IMAGES_DIR);
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Add CORS headers specifically for images
app.use('/api/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(
  '/api/images',
  express.static(IMAGES_DIR, {
    fallthrough: false,
    maxAge: '1y',
    setHeaders(res, filePath) {
      // Set proper content type and caching
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

      // Optional: add types old mime maps may miss
      const f = filePath.toLowerCase();
      if (f.endsWith('.avif')) res.type('image/avif');
      if (f.endsWith('.heic') || f.endsWith('.heif')) res.type('image/heic');
    },
  })
);

// Root route for service status
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'KicksKart backend service is running.',
    mongoHealthy
  });
});

app.get('/health', async (_req, res) => {
  const { isRedisHealthy } = await import('./config/redis.js');
  res.json({ 
    ok: true, 
    mongo: mongoHealthy,
    redis: isRedisHealthy()
  });
});

app.use('/api/track', trackingRoutes);

app.use('/api/dashboard', dashboardRoutes);


// Middleware to block API if Mongo is not healthy
app.use((req, res, next) => {
  if (!mongoHealthy && req.path !== '/' && req.path !== '/health') {
    return res.status(503).json({ error: { code: 'MONGO_UNAVAILABLE', message: 'Database unavailable. Please try again later.' } });
  }
  next();
});

app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/cache', cacheRoutes);
app.use('/api/admin/email', emailAnalyticsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
