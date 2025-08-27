import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { AuthSchemas } from './auth.dto.js';
import { authGuard } from '../../middlewares/authGuard.js';
import authLimiter from '../../config/authRateLimit.js';
import { getMe, postLogin, postLogout, postRefresh, postSignup } from './auth.controller.js';

const router = Router();

router.post('/signup', authLimiter, validate(AuthSchemas.signup), postSignup);
router.post('/login', authLimiter, validate(AuthSchemas.login), postLogin);
router.post('/refresh', authLimiter, postRefresh);
router.post('/logout', authLimiter, postLogout);
router.get('/me', authGuard, getMe);

export default router;
