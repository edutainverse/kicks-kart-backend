import { Router } from 'express';
import * as controller from './review.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { cacheMiddleware, reviewCacheKey } from '../../middlewares/cache.js';

const router = Router();

// Cache reviews for 1 hour (read-only, public data)
router.get('/:productId', cacheMiddleware(3600, reviewCacheKey), controller.getReviewsForProduct);

// No caching for POST (user-generated content)
router.post('/:productId', authGuard, controller.addReview);

export default router;
