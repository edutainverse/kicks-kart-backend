import { getRedisClient, isRedisHealthy } from '../config/redis.js';
import logger from '../config/logger.js';

/**
 * Redis cache middleware for GET requests
 * @param {number} ttlSeconds - Time to live in seconds (default: 3600 = 1 hour)
 * @param {function} keyGenerator - Function to generate cache key from req object
 */
export function cacheMiddleware(ttlSeconds = 3600, keyGenerator = null) {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching if Redis is not available
    if (!isRedisHealthy()) {
      return next();
    }

    const redisClient = getRedisClient();
    if (!redisClient) {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator 
        ? keyGenerator(req) 
        : `cache:${req.originalUrl}:${JSON.stringify(req.query)}`;

      // Try to get cached response
      const cachedResponse = await redisClient.get(cacheKey);
      
      if (cachedResponse) {
        const parsedResponse = JSON.parse(cachedResponse);
        logger.info(`Cache HIT for key: ${cacheKey}`);
        
        // Set cache headers
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Key', cacheKey);
        
        return res.status(parsedResponse.statusCode || 200).json(parsedResponse.data);
      }

      // Cache MISS - continue to next middleware but intercept response
      logger.info(`Cache MISS for key: ${cacheKey}`);
      
      // Store original res.json method
      const originalJson = res.json;
      
      // Override res.json to cache the response
      res.json = function(data) {
        // Set cache headers
        res.set('X-Cache', 'MISS');
        res.set('X-Cache-Key', cacheKey);
        
        // Cache the response asynchronously (don't wait for it)
        const responseToCache = {
          statusCode: res.statusCode,
          data: data
        };
        
        redisClient.setEx(cacheKey, ttlSeconds, JSON.stringify(responseToCache))
          .then(() => {
            logger.info(`Cached response for key: ${cacheKey}, TTL: ${ttlSeconds}s`);
          })
          .catch(err => {
            logger.error(`Failed to cache response for key: ${cacheKey}`, err);
          });

        // Call original res.json
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      // Continue without caching if there's an error
      next();
    }
  };
}

/**
 * Cache invalidation utility
 * @param {string|Array} patterns - Pattern(s) to match keys for deletion
 */
export async function invalidateCache(patterns) {
  if (!isRedisHealthy()) {
    return;
  }

  const redisClient = getRedisClient();
  if (!redisClient) {
    return;
  }

  try {
    const patternsArray = Array.isArray(patterns) ? patterns : [patterns];
    
    for (const pattern of patternsArray) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        logger.info(`Invalidated ${keys.length} cache entries matching pattern: ${pattern}`);
      }
    }
  } catch (error) {
    logger.error('Cache invalidation error:', error);
  }
}

/**
 * Clear all cache entries
 */
export async function clearAllCache() {
  if (!isRedisHealthy()) {
    return;
  }

  const redisClient = getRedisClient();
  if (!redisClient) {
    return;
  }

  try {
    await redisClient.flushAll();
    logger.info('All cache entries cleared');
  } catch (error) {
    logger.error('Cache clear error:', error);
  }
}

/**
 * Key generator for product-related caches
 */
export function productCacheKey(req) {
  const baseKey = `products:${req.route.path}`;
  const queryString = Object.keys(req.query).length > 0 ? `:${JSON.stringify(req.query)}` : '';
  const paramString = Object.keys(req.params).length > 0 ? `:${JSON.stringify(req.params)}` : '';
  return `${baseKey}${paramString}${queryString}`;
}

/**
 * Key generator for category-related caches
 */
export function categoryCacheKey(req) {
  const baseKey = `categories:${req.route.path}`;
  const paramString = Object.keys(req.params).length > 0 ? `:${JSON.stringify(req.params)}` : '';
  return `${baseKey}${paramString}`;
}

/**
 * Key generator for review-related caches
 */
export function reviewCacheKey(req) {
  const baseKey = `reviews:${req.route.path}`;
  const paramString = Object.keys(req.params).length > 0 ? `:${JSON.stringify(req.params)}` : '';
  const queryString = Object.keys(req.query).length > 0 ? `:${JSON.stringify(req.query)}` : '';
  return `${baseKey}${paramString}${queryString}`;
}
