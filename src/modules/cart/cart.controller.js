import { created, noContent, ok } from '../../utils/http.js';
import * as service from './cart.service.js';

export async function getCart(req, res, next) {
  try { const data = await service.getCart(req.user.sub); ok(res, data); } catch (e) { next(e); }
}

export async function addItem(req, res, next) {
  try { const data = await service.addItem(req.user.sub, req.body); ok(res, data); } catch (e) { next(e); }
}

export async function updateItem(req, res, next) {
  try { const data = await service.updateItem(req.user.sub, req.params.itemId, req.body); ok(res, data); } catch (e) { next(e); }
}

export async function removeItem(req, res, next) {
  try { await service.removeItem(req.user.sub, req.params.itemId); noContent(res); } catch (e) { next(e); }
}

export async function checkout(req, res, next) {
  try { const data = await service.checkout(req.user, req.body?.shippingAddress); created(res, data); } catch (e) { next(e); }
}
