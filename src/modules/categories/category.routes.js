import { Router } from 'express';
import * as controller from './category.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';
import { roleGuard } from '../../middlewares/roleGuard.js';

const router = Router();

router.get('/', controller.listCategories);
router.get('/:id', controller.getCategory);
router.post('/', authGuard, roleGuard('admin'), controller.createCategory);
router.put('/:id', authGuard, roleGuard('admin'), controller.updateCategory);
router.delete('/:id', authGuard, roleGuard('admin'), controller.deleteCategory);

export default router;
