import { Router } from 'express';
import { getAllProducts, getProductById } from '../services/productServices.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);

export default router;
