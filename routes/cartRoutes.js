import { Router } from 'express';
import {
  addToCart,
  deleteFromCart,
  checkoutCart,
} from '../services/cartServices.js';

const router = Router();

router.put('/:productId', addToCart);
router.delete('/:productId', deleteFromCart);
router.post('/checkout', checkoutCart);

export default router;
