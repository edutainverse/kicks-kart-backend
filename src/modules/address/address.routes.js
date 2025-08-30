import { Router } from 'express';
import * as controller from './address.controller.js';
import { authGuard } from '../../middlewares/authGuard.js';

const router = Router();

router.get('/', authGuard, controller.getAddresses);
router.post('/', authGuard, controller.addAddress);
router.put('/:addressId', authGuard, controller.updateAddress);
router.delete('/:addressId', authGuard, controller.deleteAddress);

export default router;
