import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { Product } from '../models';
import { BadRequest, InternalServerError, NotFound } from '../middleware/errorHandler';
import { getProductsFromFile } from './import.services';
import { fileUploadLogger } from '../utils/eventLogger';
import { importProductsFromCSV } from '../controllers';

const productsFilePath = path.join(
  process.cwd(),
  'storage',
  'products.store.json'
);

export const createNewProduct = async ({
  name,
  description,
  category,
  price,
}: {
  name: string;
  description: string;
  category: string;
  price: number;
}): Promise<Product> => {
  if (!name || !description || !category || typeof price !== 'number') {
    throw new BadRequest(
      'All fields are required, and price must be a number!'
    );
  }

  const newProduct: Product = {
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

  return newProduct;
};

export const getProductByIdService = async (productId: string): Promise<Product> => {
  try {
    const products = await getProductsFromFile();
    const product = products.find((product) => product.id === productId);

    if (!product) {
      throw new NotFound('Product not found');
    }

    return product;
  } catch (error) {
    throw new InternalServerError('Error fetching product by ID');
  }
};

export const importProductsService = async (
  file: Express.Multer.File
): Promise<any> => {
  if (!file) {
    throw new BadRequest('There is no file to import');
  }

  const csvFilePath = path.join(__dirname, '../uploads', file.filename);

  try {
    fileUploadLogger.emit('fileUploadStart', 'File upload has started');

    const importedProducts = await importProductsFromCSV(csvFilePath);

    fileUploadLogger.emit('fileUploadEnd', 'File has been uploaded');

    return importedProducts;
  } catch (error) {
    fileUploadLogger.emit(
      'fileUploadFailed',
      `Error occurred: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    throw new InternalServerError(
      `Failed to import products: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};