import { ok } from '../../utils/http.js';
import { handleWebhook, processOutcome } from './payments.service.js';

export async function postWebhook(req, res, next) {
  try {
    await handleWebhook(req.rawBody, req.headers['x-fp-signature']);
    const result = await processOutcome(req.body);
    ok(res, result);
  } catch (e) {
    next(e);
  }
}

// Fake payment endpoint for testing (no real money involved)
export async function fakePay(req, res, next) {
  try {
    // expects { paymentIntentId } in body
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) return next({ status: 400, message: 'paymentIntentId required' });
    const result = await processOutcome({ paymentIntentId, outcome: 'succeeded' });
    ok(res, result);
  } catch (e) {
    next(e);
  }
}
