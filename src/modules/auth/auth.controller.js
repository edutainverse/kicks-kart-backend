import { created, noContent, ok } from '../../utils/http.js';
import * as service from './auth.service.js';

export async function postSignup(req, res, next) {
  try {
    const user = await service.signup(req.body);
    created(res, user);
  } catch (e) {
    next(e);
  }
}

export async function postLogin(req, res, next) {
  try {
    const result = await service.login(req.body, res);
    ok(res, result);
  } catch (e) {
    next(e);
  }
}

export async function postRefresh(req, res, next) {
  try {
    const result = await service.refresh(req, res);
    ok(res, result);
  } catch (e) {
    next(e);
  }
}

export async function postLogout(req, res, next) {
  try {
    await service.logout(req, res);
    noContent(res);
  } catch (e) {
    next(e);
  }
}

export async function getMe(req, res, next) {
  try {
    const data = await service.me(req.user.sub);
    ok(res, data);
  } catch (e) {
    next(e);
  }
}
