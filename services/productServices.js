import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { getProductsFromFile, importProductsFromCSV, } from './importServices.js';
import { fileUploadLogger } from '../utils/eventLogger.js';
import { BadRequest, NotFound, InternalServerError, } from '../middleware/errorHandler.js';

const productsFilePath = path.join(
  process.cwd(),
  'storage',
  'products.store.json'
);

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price } = req.body;

    if (!name || !description || !category || typeof price !== 'number') {
      throw new BadRequest(
        'All fields are required, and price must be a number!'
      );
    }

    const newProduct = {
      id: randomUUID(),
      name,
      description,
      category,
      price,
    };

    const products = await getProductsFromFile();
    products.push(newProduct);

    await fs.promises.writeFile(
      productsFilePath,
      JSON.stringify(products, null, 2)
    );

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await getProductsFromFile();
    res.status(200).json(products);
  } catch (error) {
    next(new InternalServerError('Failed to retrieve products'));
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const products = await getProductsFromFile();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new NotFound('Product not found');
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const importProducts = async (req, res, next) => {
  try {
    fileUploadLogger.emit('fileUploadStart', 'File upload has started');

    const csvFilePath = path.join(process.cwd(), 'uploads', req.file.filename);
    const importedProducts = await importProductsFromCSV(csvFilePath);

    fileUploadLogger.emit('fileUploadEnd', 'File has been uploaded');

    res.status(201).json({
      message: 'Products imported successfully',
      importedProducts,
    });
  } catch (error) {
    fileUploadLogger.emit(
      'fileUploadFailed',
      `Error occurred: ${error.message}`
    );
    next(new InternalServerError('Failed to import products'));
  }
};
