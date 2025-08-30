import { Router } from 'express';
import * as controller from './wishlist.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';

const router = Router();

router.get('/', authGuard, controller.getWishlist);
router.post('/add', authGuard, controller.addToWishlist);
router.post('/remove', authGuard, controller.removeFromWishlist);

export default router;
