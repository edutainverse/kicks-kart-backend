import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { getOrderById, listMyOrders } from './order.controller.js';

const router = Router();
router.use(authGuard);
router.get('/', listMyOrders);
router.get('/:id', getOrderById);
export default router;
