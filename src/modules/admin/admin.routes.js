import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard.js';
import { roleGuard } from '../../middlewares/roleGuard.js';
import { createProduct, deleteProduct, getOrders, getStats, getUsers, listProducts, patchInventory, patchOrder, patchUser, updateProduct } from './admin.controller.js';
import { validate } from '../../middlewares/validate.js';
import { AdminSchemas } from './admin.dto.js';

const router = Router();
router.use(authGuard, roleGuard('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id', validate(AdminSchemas.patchUser), patchUser);

router.get('/orders', validate(AdminSchemas.listOrders), getOrders);
router.patch('/orders/:id', validate(AdminSchemas.patchOrder), patchOrder);

router.get('/products', listProducts);
router.post('/products', validate(AdminSchemas.createProduct), createProduct);
router.patch('/products/:id', validate(AdminSchemas.updateProduct), updateProduct);
router.delete('/products/:id', deleteProduct);

router.patch('/inventory/:productId', validate(AdminSchemas.patchInventory), patchInventory);

export default router;
