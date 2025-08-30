import { createClient } from 'redis';
import logger from './logger.js';
import { env } from './env.js';

let redisClient = null;
let redisHealthy = false;

export async function connectRedis() {
  try {
    // Create Redis client with connection string or default local Redis
    const redisUrl = env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
        lazyConnect: true
      }
    });

    // Redis event handlers
    redisClient.on('connect', () => {
      logger.info('Redis connecting...');
    });

    redisClient.on('ready', async () => {
      logger.info('Redis connected and ready');
      redisHealthy = true;
      
      // Clear all cache on server restart for fresh data
      try {
        await redisClient.flushAll();
        logger.info('Cache cleared on server restart');
      } catch (error) {
        logger.error('Failed to clear cache on startup:', error);
      }
    });

    redisClient.on('error', (err) => {
      logger.error('Redis error:', err);
      redisHealthy = false;
    });

    redisClient.on('end', () => {
      logger.warn('Redis connection ended');
      redisHealthy = false;
    });

    // Connect to Redis
    await redisClient.connect();
    
    // Test the connection
    await redisClient.ping();
    logger.info('Redis ping successful');
    
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error.message);
    redisHealthy = false;
    redisClient = null;
    // Don't throw error, let app continue without Redis
    return null;
  }
}

export function getRedisClient() {
  return redisClient;
}

export function isRedisHealthy() {
  return redisHealthy && redisClient?.isReady;
}

export async function disconnectRedis() {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis disconnected');
    } catch (error) {
      logger.error('Error disconnecting Redis:', error);
    }
  }
}

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  await disconnectRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectRedis();
  process.exit(0);
});
