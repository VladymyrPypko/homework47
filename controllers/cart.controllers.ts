import { Request, Response, NextFunction } from 'express';
import {
  getUserCart,
  addToUserCart,
  deleteFromUserCart,
  checkoutUserCart,
  getUserOrders,
  validateTotalPrice,
} from '../services';

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = getUserCart(req.body);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;

    const cart = addToUserCart(userId, productId);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const deleteFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;

    const cart = deleteFromUserCart(userId, productId);
    res
      .status(200)
      .json({ message: 'Product has been deleted from cart', cart });
  } catch (error) {
    next(error);
  }
};

export const checkoutCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { totalPrice }: { totalPrice: number } = req.body;

    validateTotalPrice(totalPrice);

    const order = checkoutUserCart(userId, totalPrice);

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const orders = getUserOrders(userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
