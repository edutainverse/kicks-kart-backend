import { Router } from 'express';
import { postWebhook } from './payments.controller.js';
import { validate } from '../../middlewares/validate.js';
import { PaymentSchemas } from './payments.dto.js';

const router = Router();

router.post('/webhook', validate(PaymentSchemas.webhook), postWebhook);

export default router;
