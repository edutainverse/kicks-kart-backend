import { Router } from 'express';
import * as controller from './review.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';

const router = Router();

router.get('/:productId', controller.getReviewsForProduct);
router.post('/:productId', authGuard, controller.addReview);

export default router;
