import { Router } from 'express';
import { getCart, addToCart, deleteFromCart, checkoutCart, getOrders } from '../services/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/cart', authMiddleware, getCart);
router.put('/cart/:productId', authMiddleware, addToCart);
router.delete('/cart/:productId', authMiddleware, deleteFromCart);
router.post('/cart/checkout', authMiddleware, checkoutCart);
router.get('/orders', authMiddleware, getOrders);

export default router;
