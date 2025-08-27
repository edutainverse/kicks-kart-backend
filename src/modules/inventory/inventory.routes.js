import { Router } from 'express';
import { patchInventory } from './inventory.controller.js';

const router = Router();

router.patch('/:productId', patchInventory);

export default router;
