import { Router, Request, Response } from 'express';
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import {
  createProduct,
  getAllProducts,
  getProductById,
  importProducts,
} from '../controllers/product.controllers';

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
