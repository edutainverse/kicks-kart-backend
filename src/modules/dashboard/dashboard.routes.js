import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';

const router = Router();


router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/orders-trend', dashboardController.getOrdersTrend);

export default router;
