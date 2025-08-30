import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { getOrderById, listMyOrders } from './order.controller.js';

const router = Router();
router.use(authGuard);
router.get('/', listMyOrders);
import { getLatestOrder } from './order.controller.js';
router.get('/latest', getLatestOrder);
router.get('/:id', getOrderById);
export default router;
