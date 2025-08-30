import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { roleGuard } from '../../middlewares/roleGuard.js';
import { clearAllCache, invalidateCache } from '../../middlewares/cache.js';
import { getRedisClient, isRedisHealthy } from '../../config/redis.js';
import { ok } from '../../utils/http.js';

const router = Router();

// Admin only routes
router.use(authGuard, roleGuard('admin'));

// Get cache status
router.get('/status', async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const healthy = isRedisHealthy();
    
    let info = null;
    if (healthy && redis) {
      try {
        // Get Redis info
        const keys = await redis.keys('*');
        const memory = await redis.memory('usage');
        info = {
          totalKeys: keys.length,
          memoryUsage: memory,
          keysByPattern: {
            products: keys.filter(k => k.startsWith('products:')).length,
            categories: keys.filter(k => k.startsWith('categories:')).length,
            reviews: keys.filter(k => k.startsWith('reviews:')).length,
            cache: keys.filter(k => k.startsWith('cache:')).length
          }
        };
      } catch (error) {
        info = { error: error.message };
      }
    }
    
    ok(res, {
      healthy,
      connected: redis?.isReady || false,
      info
    });
  } catch (e) {
    next(e);
  }
});

// Clear all cache
router.delete('/clear', async (req, res, next) => {
  try {
    await clearAllCache();
    ok(res, { message: 'All cache cleared successfully' });
  } catch (e) {
    next(e);
  }
});

// Clear specific cache patterns
router.delete('/clear/:pattern', async (req, res, next) => {
  try {
    const { pattern } = req.params;
    await invalidateCache([`${pattern}:*`]);
    ok(res, { message: `Cache cleared for pattern: ${pattern}` });
  } catch (e) {
    next(e);
  }
});

export default router;
