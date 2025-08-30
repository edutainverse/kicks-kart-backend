import mongoose from 'mongoose';
import logger from '../config/logger.js';

export let mongoHealthy = false;

export async function connect(uri) {
  mongoose.connection.on('connected', () => {
    logger.info('Mongo connected');
    mongoHealthy = true;
  });
  mongoose.connection.on('disconnected', () => {
    logger.warn('Mongo disconnected');
    mongoHealthy = false;
  });
  mongoose.connection.on('error', (err) => {
    logger.error('Mongo error', err);
    mongoHealthy = false;
  });

  try {
    await mongoose.connect(uri, { autoIndex: true });
    mongoHealthy = true;
  } catch (err) {
    logger.error('Mongo initial connect failed', err);
    mongoHealthy = false;
  }
}
