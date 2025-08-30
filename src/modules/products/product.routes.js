import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { ProductSchemas } from './product.dto.js';
import { getProduct, listProducts } from './product.controller.js';
import { cacheMiddleware, productCacheKey } from '../../middlewares/cache.js';

const router = Router();

// Cache product list for 1 hour (3600 seconds)
router.get('/', validate(ProductSchemas.list), cacheMiddleware(3600, productCacheKey), listProducts);

// Cache individual product for 1 hour
router.get('/:idOrSlug', validate(ProductSchemas.byId), cacheMiddleware(3600, productCacheKey), getProduct);

export default router;
