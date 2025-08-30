import dotenv from 'dotenv';

export function loadEnv() {
  dotenv.config();
}

export const env = {
  get PORT() { return parseInt(process.env.PORT || '4000', 10); },
  get NODE_ENV() { return process.env.NODE_ENV || 'development'; },
  get APP_URL() { return process.env.APP_URL || 'http://localhost:5173'; },
  get CORS_ORIGIN() { return process.env.CORS_ORIGIN || 'http://localhost:5173'; },
  // Require MONGO_URI to be provided via environment; no hardcoded defaults with credentials
  get MONGO_URI() { return process.env.MONGO_URI; },
  get REDIS_URL() { return process.env.REDIS_URL || 'redis://localhost:6379'; },
  get JWT_ACCESS_SECRET() { return process.env.JWT_ACCESS_SECRET || 'change-me'; },
  get JWT_REFRESH_SECRET() { return process.env.JWT_REFRESH_SECRET || 'change-me-too'; },
  get ACCESS_TOKEN_TTL_MIN() { return parseInt(process.env.ACCESS_TOKEN_TTL_MIN || '15', 10); },
  get REFRESH_TOKEN_TTL_DAYS() { return parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10); },
  get COOKIE_SECURE() { return /^true$/i.test(process.env.COOKIE_SECURE || 'false'); },
  get FAKEPAY_WEBHOOK_SECRET() { return process.env.FAKEPAY_WEBHOOK_SECRET || 'whsec_test_123'; },
  get SMTP_HOST() { return process.env.SMTP_HOST; },
  get SMTP_PORT() { return parseInt(process.env.SMTP_PORT || '587', 10); },
  get SMTP_SECURE() { return process.env.SMTP_SECURE || 'false'; },
  get SMTP_USER() { return process.env.SMTP_USER; },
  get SMTP_PASS() { return process.env.SMTP_PASS; },
  get SMTP_FROM() { return process.env.SMTP_FROM; },
};
