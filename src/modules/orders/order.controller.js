export async function getLatestOrder(req, res, next) {
  try {
    const data = await service.getLatestOrder(req.user.sub);
    if (!data) return next({ status: 404, code: 'NOT_FOUND', message: 'No orders found' });
    ok(res, data);
  } catch (e) { next(e); }
}
import { ok } from '../../utils/http.js';
import * as service from './order.service.js';

export async function listMyOrders(req, res, next) {
  try { const data = await service.listMy(req.user.sub); ok(res, data); } catch (e) { next(e); }
}

export async function getOrderById(req, res, next) {
  try { const data = await service.getByIdUser(req.user.sub, req.params.id); if (!data) return next({ status: 404, code: 'NOT_FOUND', message: 'Order not found' }); ok(res, data); } catch (e) { next(e); }
}
