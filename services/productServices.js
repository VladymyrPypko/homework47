import { products } from '../storage.js';

export const getAllProducts = async (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: `Can't' get the products: `, error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = products.find(
      (product) => product.id === parseInt(req.params.productId)
    );
    if (!product) {
      return res.status(500).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: `Can't' get the product: `, error });
  }
};
