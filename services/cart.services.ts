import { randomUUID } from 'crypto';
import { carts, orders, } from '../storage/storage';
import { NotFound, BadRequest } from '../middleware/errorHandler';
import { Cart, Order } from '../models';

export const getUserCart = ({ userId }: { userId?: string }) => {
  if (!userId) {
    throw new NotFound('User ID is required');
  }

  const userCart = carts.find((cart: Cart) => cart.userId === userId);

  if (!userCart) {
    throw new NotFound('Cart not found');
  }

  return userCart;
};

export const addToUserCart = (userId: string, productId: string) => {
  let cart = carts.find((cart: Cart) => cart.userId === userId);

  if (!cart) {
    cart = {
      id: randomUUID(),
      userId,
      products: [],
    };
    carts.push(cart);
  }

  const existingProduct = cart.products.find(
    (product) => product.productId === productId
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ productId, quantity: 1 });
  }

  return cart;
};

export const deleteFromUserCart = (userId: string, productId: string) => {
  const cart = carts.find((cart: Cart) => cart.userId === userId);
  if (!cart) {
    throw new NotFound('Cart not found');
  }

  cart.products = cart.products.filter(
    (product) => product.productId !== productId
  );

  if (!cart.products.length) {
    carts.splice(carts.indexOf(cart), 1);
  }

  return cart;
};

export const validateTotalPrice = (totalPrice: any) => {
  if (totalPrice === undefined || typeof totalPrice !== 'number') {
    throw new BadRequest('Total price is required and must be a number');
  }
};

export const checkoutUserCart = (userId: string, totalPrice: number) => {
  const cart = carts.find((cart: Cart) => cart.userId === userId);

  if (!cart) {
    throw new NotFound('Cart not found');
  }

  const order: Order = {
    id: randomUUID(),
    userId,
    products: cart.products,
    totalPrice,
  };

  orders.push(order);

  carts.splice(carts.indexOf(cart), 1);

  return order;
};

export const getUserOrders = (userId: string): Order[] => {
  const userOrders = orders.filter((order) => order.userId === userId);

  if (!userOrders.length) {
    throw new NotFound('No orders found for this user');
  }

  return userOrders;
};
