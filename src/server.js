import http from 'http';
import app from './app.js';
import { loadEnv, env } from './config/env.js';
import { connect } from './db/connect.js';
import logger from './config/logger.js';

async function start() {
  loadEnv();
  await connect(env.MONGO_URI); // Don't throw on error

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    logger.info(`Server listening on http://localhost:${env.PORT}/api`);
    if (process.env.NODE_ENV !== 'production') {
      // Import mongoHealthy directly for ES modules
      import('./db/connect.js').then(({ mongoHealthy }) => {
        console.log('Server started. Mongo healthy:', mongoHealthy);
      });
    }
  });
}

start();
