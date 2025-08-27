import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { roleGuard } from '../../middlewares/roleGuard.js';
import { listUsers, updateUserRole } from './user.controller.js';

const router = Router();
router.use(authGuard, roleGuard('admin'));
router.get('/', listUsers);
router.patch('/:id', updateUserRole);
export default router;
