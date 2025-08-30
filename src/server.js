import http from 'http';
import app from './app.js';
import { loadEnv, env } from './config/env.js';
import { connect } from './db/connect.js';
import { connectRedis } from './config/redis.js';
import logger from './config/logger.js';

async function start() {
  loadEnv();
  await connect(env.MONGO_URI); // Don't throw on error
  
  // Connect to Redis (don't throw on error, let app work without Redis)
  await connectRedis();

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    logger.info(`Server listening on http://localhost:${env.PORT}/api`);
    if (process.env.NODE_ENV !== 'production') {
      // Import health status for ES modules
      Promise.all([
        import('./db/connect.js').then(({ mongoHealthy }) => mongoHealthy),
        import('./config/redis.js').then(({ isRedisHealthy }) => isRedisHealthy())
      ]).then(([mongoHealthy, redisHealthy]) => {
        console.log('Server started. Mongo healthy:', mongoHealthy, 'Redis healthy:', redisHealthy);
      });
    }
  });
}

start();
