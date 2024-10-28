import { Router, Request, Response } from 'express';
import { uploadMiddleware } from '../middleware/uploadMiddleware';
import {
  createProduct,
  getAllProducts,
  getProductById,
  importProducts,
} from '../controllers';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkUserPermissions } from '../middleware/permissionsMiddleware';
import { APP_ROLES } from '../models';

const router = Router();

router.post(
  '/product',
  authMiddleware,
  checkUserPermissions([APP_ROLES.Admin]),
  createProduct
);
router.get('/products', getAllProducts);
router.get('/products/:productId', getProductById);
router.post(
  '/products/import',
  authMiddleware,
  checkUserPermissions([APP_ROLES.Admin]),
  uploadMiddleware.single('file'),
  importProducts
);

export default router;
