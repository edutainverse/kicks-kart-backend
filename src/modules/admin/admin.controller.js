import { ok, created, noContent } from '../../utils/http.js';
import * as svc from './admin.service.js';
import * as productSvc from '../products/product.service.js';
import * as inventorySvc from '../inventory/inventory.service.js';
import { invalidateCache } from '../../middlewares/cache.js';

export async function getStats(_req, res, next) { try { ok(res, await svc.stats()); } catch (e) { next(e); } }
export async function getUsers(req, res, next) { try { ok(res, await svc.listUsers(req.query)); } catch (e) { next(e); } }
export async function getUserDetails(req, res, next) { try { ok(res, await svc.getUserDetails(req.params.id)); } catch (e) { next(e); } }
export async function getUserOrders(req, res, next) { try { ok(res, await svc.getUserOrders(req.params.id)); } catch (e) { next(e); } }
export async function patchUser(req, res, next) { try { ok(res, await svc.patchUser(req.params.id, req.body)); } catch (e) { next(e); } }
export async function getOrders(req, res, next) { try { ok(res, await svc.listOrders(req.query)); } catch (e) { next(e); } }
export async function getOrder(req, res, next) { try { ok(res, await svc.getOrderById(req.params.id)); } catch (e) { next(e); } }
export async function patchOrder(req, res, next) { try { ok(res, await svc.patchOrder(req.params.id, req.body.status)); } catch (e) { next(e); } }

export async function createProduct(req, res, next) { 
  try { 
    const result = await productSvc.create(req.body);
    // Invalidate product caches
    await invalidateCache(['products:*']);
    created(res, result); 
  } catch (e) { next(e); } 
}

export async function updateProduct(req, res, next) { 
  try { 
    const result = await productSvc.update(req.params.id, req.body);
    // Invalidate product caches
    await invalidateCache(['products:*']);
    ok(res, result); 
  } catch (e) { next(e); } 
}

export async function deleteProduct(req, res, next) { 
  try { 
    await productSvc.remove(req.params.id);
    // Invalidate product caches
    await invalidateCache(['products:*']);
    noContent(res); 
  } catch (e) { next(e); } 
}

export async function listProducts(req, res, next) { try { ok(res, await svc.listProducts()); } catch (e) { next(e); } }

export async function patchInventory(req, res, next) { 
  try { 
    const result = await inventorySvc.setVariants(req.params.productId, req.body.variants || []);
    // Invalidate product caches since inventory affects product data
    await invalidateCache(['products:*']);
    ok(res, result); 
  } catch (e) { next(e); } 
}
