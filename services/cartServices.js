import { randomUUID } from 'crypto';
import { carts, orders } from '../storage/storage.js';

export const getCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userCart = carts.find((cart) => cart.userId === userId);

    if (!userCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(userCart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    let cart = carts.find((cart) => cart.userId === userId);
    if (!cart) {
      cart = {
        id: randomUUID(),
        userId,
        products: [],
      };
      carts.push(cart);
    }

    cart.products.push({ productId, quantity: 1 });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const deleteFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;

    const cart = carts.find((cart) => cart.userId === userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (product) => product.productId !== productId
    );
    if (!cart.products.length) {
      carts.splice(carts.indexOf(cart), 1);
    }
    res
      .status(200)
      .json({ message: 'Product has been deleted from cart', cart });
  } catch (error) {
    next(error);
  }
};

export const checkoutCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { totalPrice } = req.body;

    const cart = carts.find((cart) => cart.userId === userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const order = {
      id: randomUUID(),
      userId,
      products: cart.products,
      totalPrice,
    };

    orders.push(order);
    carts.splice(carts.indexOf(cart), 1);

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userOrders = orders.filter((order) => order.userId === userId);
    res.status(200).json(userOrders);
  } catch (error) {
    next(error);
  }
};
