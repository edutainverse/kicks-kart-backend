import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { ProductSchemas } from './product.dto.js';
import { getProduct, listProducts } from './product.controller.js';

const router = Router();

router.get('/', validate(ProductSchemas.list), listProducts);
router.get('/:idOrSlug', validate(ProductSchemas.byId), getProduct);

export default router;
