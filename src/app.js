import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from './config/rateLimit.js';
import { corsOptions } from './config/security.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { mongoHealthy } from './db/connect.js';

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



// Root route for service status
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'KicksKart backend service is running.',
    mongoHealthy
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});


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

app.use(notFound);
app.use(errorHandler);

export default app;
