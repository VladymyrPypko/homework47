import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { randomUUID } from 'crypto';
import { InternalServerError } from '../middleware/errorHandler';
import { Product } from '../models';

const productsFilePath = path.join(
  process.cwd(),
  'storage',
  'products.store.json'
);

export const getProductsFromFile = async (): Promise<Product[]> => {
  try {
    const productsData = await fs.promises.readFile(productsFilePath, 'utf8');
    return JSON.parse(productsData) as Product[];
  } catch (error) {
    throw new InternalServerError('Error reading products file');
  }
};

export const importProductsFromCSVService = (
  csvFilePath: string
): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const importedProducts: Product[] = [];

    if (!fs.existsSync(csvFilePath)) {
      return reject(new InternalServerError('CSV file does not exist'));
    }

    getProductsFromFile()
      .then((existingProducts) => {
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            const { name, description, category, price } = row;

            if (name && description && category && price) {
              const newProduct: Product = {
                id: randomUUID(),
                name,
                description,
                category,
                price: Number(price),
              };
              importedProducts.push(newProduct);
            } else {
              console.warn('Invalid row skipped:', row);
            }
          })
          .on('end', async () => {
            console.log('CSV file successfully processed');
            const allProducts = [...existingProducts, ...importedProducts];

            try {
              await fs.promises.writeFile(
                productsFilePath,
                JSON.stringify(allProducts, null, 2)
              );
              resolve(importedProducts);
            } catch (error) {
              reject(new InternalServerError('Error saving products to file'));
            }
          })
          .on('error', (error) => {
            console.error('Error while reading CSV file:', error);
            reject(new InternalServerError('Error reading CSV file'));
          });
      })
      .catch(() =>
        reject(new InternalServerError('Error fetching existing products'))
      );
  });
};
