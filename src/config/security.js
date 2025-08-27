import { env } from './env.js';

export const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
};
