import { randomUUID } from 'crypto';
import { carts, products } from '../storage.js';

export const addToCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const productId = req.params.productId;

    if (!userId) {
      return res.status(401).json({ message: 'Access denied: Unauthorized' });
    }

    const product = products.find(
      (product) => product.id === parseInt(productId)
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = carts.find((cart) => cart.userId === userId);
    if (!cart) {
      cart = {
        id: randomUUID(),
        userId,
        products: [],
      };
      carts.push(cart);
    }

    cart.products.push(product);
    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: `Can't add a product to the cart`,
      error,
    });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const productId = req.params.productId;

    if (!userId) {
      return res.status(401).json({ message: 'Access denied: Unauthorized' });
    }

    const cart = carts.find((cart) => cart.userId === userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (product) => product.id !== parseInt(productId)
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: `Can't delete a product from the cart`,
      error,
    });
  }
};

export const checkoutCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ message: 'Access denied: Unauthorized' });
    }

    const cart = carts.find((cart) => cart.userId === userId);
    if (!cart || !cart.products.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = cart.products.reduce(
      (acc, product) => acc + product.price,
      0
    );
    const order = {
      id: randomUUID(),
      userId,
      products: cart.products,
      totalPrice,
    };

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error: ', error });
  }
};