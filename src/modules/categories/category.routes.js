import { Router } from 'express';
import * as controller from './category.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { roleGuard } from '../../middlewares/roleGuard.js';
import { cacheMiddleware, categoryCacheKey } from '../../middlewares/cache.js';

const router = Router();

// Cache public category endpoints for 1 hour
router.get('/', cacheMiddleware(3600, categoryCacheKey), controller.listCategories);
router.get('/:id', cacheMiddleware(3600, categoryCacheKey), controller.getCategory);

// Admin routes (no caching for admin operations)
router.post('/', authGuard, roleGuard('admin'), controller.createCategory);
router.put('/:id', authGuard, roleGuard('admin'), controller.updateCategory);
router.delete('/:id', authGuard, roleGuard('admin'), controller.deleteCategory);

export default router;
