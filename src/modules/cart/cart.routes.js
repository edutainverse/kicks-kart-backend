import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { addItem, checkout, getCart, removeItem, updateItem } from './cart.controller.js';
import { validate } from '../../middlewares/validate.js';
import { CartSchemas } from './cart.dto.js';

const router = Router();

router.use(authGuard);
router.get('/', getCart);
router.post('/items', validate(CartSchemas.add), addItem);
router.patch('/items/:itemId', validate(CartSchemas.update), updateItem);
router.delete('/items/:itemId', validate(CartSchemas.remove), removeItem);
router.post('/checkout', checkout);

export default router;
