import dotenv from 'dotenv';

export function loadEnv() {
  dotenv.config();
}

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.APP_URL || 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MONGO_URI:
    process.env.MONGO_URI ||
    'mongodb+srv://kickskart:KICKatkart2025@kickskart.twwmu5f.mongodb.net/?retryWrites=true&w=majority&appName=KICKSKART',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'change-me',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'change-me-too',
  ACCESS_TOKEN_TTL_MIN: parseInt(process.env.ACCESS_TOKEN_TTL_MIN || '15', 10),
  REFRESH_TOKEN_TTL_DAYS: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10),
  COOKIE_SECURE: /^true$/i.test(process.env.COOKIE_SECURE || 'false'),
  FAKEPAY_WEBHOOK_SECRET: process.env.FAKEPAY_WEBHOOK_SECRET || 'whsec_test_123',
};
