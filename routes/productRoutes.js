import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  importProducts,
} from '../services/index.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/product', createProduct);
router.get('/products', getAllProducts);
router.get('/products/:productId', getProductById);
router.post(
  '/products/import',
  uploadMiddleware.single('file'),
  importProducts
);

export default router;
