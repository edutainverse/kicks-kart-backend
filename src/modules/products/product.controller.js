import { created, noContent, ok } from '../../utils/http.js';
import * as service from './product.service.js';

export async function listProducts(req, res, next) {
  try {
    const data = await service.list(req.query);
    ok(res, data);
  } catch (e) { next(e); }
}

export async function getProduct(req, res, next) {
  try {
    const data = await service.getByIdOrSlug(req.params.idOrSlug);
    if (!data) return next({ status: 404, code: 'NOT_FOUND', message: 'Product not found' });
    ok(res, data);
  } catch (e) { next(e); }
}

export async function createProduct(req, res, next) {
  try {
    const prod = await service.create(req.body);
    created(res, prod);
  } catch (e) { next(e); }
}

export async function updateProduct(req, res, next) {
  try {
    const prod = await service.update(req.params.id, req.body);
    ok(res, prod);
  } catch (e) { next(e); }
}

export async function deleteProduct(req, res, next) {
  try {
    await service.remove(req.params.id);
    noContent(res);
  } catch (e) { next(e); }
}
