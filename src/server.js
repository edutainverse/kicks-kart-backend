import http from 'http';
import app from './app.js';
import { loadEnv, env } from './config/env.js';
import { connect } from './db/connect.js';
import logger from './config/logger.js';

async function start() {
  loadEnv();
  await connect(env.MONGO_URI);

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    logger.info(`Server listening on http://localhost:${env.PORT}/api`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error', err);
  process.exit(1);
});
