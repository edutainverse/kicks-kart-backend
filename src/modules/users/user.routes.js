import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { roleGuard } from '../../middlewares/roleGuard.js';
import { listUsers, updateUserRole, getMe, updateMe, changePassword } from './user.controller.js';


const router = Router();

// Admin routes
router.use(authGuard, roleGuard('admin'));
router.get('/', listUsers);
router.patch('/:id', updateUserRole);

// User self-service routes
router.get('/me', authGuard, getMe);
router.put('/me', authGuard, updateMe);
router.put('/me/password', authGuard, changePassword);

export default router;
