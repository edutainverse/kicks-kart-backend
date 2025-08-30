import { Router } from 'express';
import { postWebhook } from './payments.controller.js';

import { fakePay } from './payments.controller.js';
import { validate } from '../../middlewares/validate.js';
import { PaymentSchemas } from './payments.dto.js';

const router = Router();

router.post('/webhook', validate(PaymentSchemas.webhook), postWebhook);

// Fake payment endpoint for testing (no real money involved)
router.post('/fakepay', fakePay);

export default router;
