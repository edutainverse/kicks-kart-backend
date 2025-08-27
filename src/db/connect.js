import mongoose from 'mongoose';
import logger from '../config/logger.js';

export async function connect(uri) {
  mongoose.connection.on('connected', () => logger.info('Mongo connected'));
  mongoose.connection.on('disconnected', () => logger.warn('Mongo disconnected'));
  mongoose.connection.on('error', (err) => logger.error('Mongo error', err));

  await mongoose.connect(uri, {
    autoIndex: true,
  });
}
