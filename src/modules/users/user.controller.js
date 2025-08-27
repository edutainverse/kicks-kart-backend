import { ok } from '../../utils/http.js';
import * as svc from './user.service.js';

export async function listUsers(_req, res, next) { try { ok(res, await svc.list()); } catch (e) { next(e); } }
export async function updateUserRole(req, res, next) { try { ok(res, await svc.updateRole(req.params.id, req.body.role)); } catch (e) { next(e); } }
