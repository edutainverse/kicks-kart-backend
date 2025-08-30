import { ok, created, noContent } from '../../utils/http.js';
import * as svc from './admin.service.js';
import * as productSvc from '../products/product.service.js';
import * as inventorySvc from '../inventory/inventory.service.js';

export async function getStats(_req, res, next) { try { ok(res, await svc.stats()); } catch (e) { next(e); } }
export async function getUsers(req, res, next) { try { ok(res, await svc.listUsers(req.query)); } catch (e) { next(e); } }
export async function patchUser(req, res, next) { try { ok(res, await svc.patchUser(req.params.id, req.body)); } catch (e) { next(e); } }
export async function getOrders(req, res, next) { try { ok(res, await svc.listOrders(req.query)); } catch (e) { next(e); } }
export async function getOrder(req, res, next) { try { ok(res, await svc.getOrderById(req.params.id)); } catch (e) { next(e); } }
export async function patchOrder(req, res, next) { try { ok(res, await svc.patchOrder(req.params.id, req.body.status)); } catch (e) { next(e); } }

export async function createProduct(req, res, next) { try { created(res, await productSvc.create(req.body)); } catch (e) { next(e); } }
export async function updateProduct(req, res, next) { try { ok(res, await productSvc.update(req.params.id, req.body)); } catch (e) { next(e); } }
export async function deleteProduct(req, res, next) { try { await productSvc.remove(req.params.id); noContent(res); } catch (e) { next(e); } }
export async function listProducts(req, res, next) { try { ok(res, await svc.listProducts()); } catch (e) { next(e); } }
export async function patchInventory(req, res, next) { try { ok(res, await inventorySvc.setVariants(req.params.productId, req.body.variants || [])); } catch (e) { next(e); } }
