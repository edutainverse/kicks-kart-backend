import { ok } from '../../utils/http.js';
import * as service from './inventory.service.js';

export async function patchInventory(req, res, next) {
  try {
    const data = await service.setVariants(req.params.productId, req.body.variants || []);
    ok(res, data);
  } catch (e) { next(e); }
}
