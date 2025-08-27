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
