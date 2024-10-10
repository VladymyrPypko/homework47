import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { randomUUID } from 'crypto';
import { InternalServerError } from '../middleware/errorHandler.js';

const productsFilePath = path.join(
  process.cwd(),
  'storage',
  'products.store.json'
);

export const getProductsFromFile = async () => {
  try {
    const productsData = await fs.promises.readFile(productsFilePath, 'utf8');
    return JSON.parse(productsData);
  } catch (error) {
    throw new InternalServerError('Error reading products file');
  }
};

export const importProductsFromCSV = (csvFilePath) => {
  return new Promise((resolve, reject) => {
    const importedProducts = [];
    const existingProducts = [];

    getProductsFromFile()
      .then((products) => {
        existingProducts.push(...products);

        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
            const { name, description, category, price } = row;
            if (name && description && category && price) {
              const newProduct = {
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
          .on('end', () => {
            const allProducts = [...existingProducts, ...importedProducts];

            fs.promises
              .writeFile(productsFilePath, JSON.stringify(allProducts, null, 2))
              .then(() => resolve(importedProducts))
              .catch((err) =>
                reject(new InternalServerError('Error saving products to file'))
              );
          })
          .on('error', (error) => {
            reject(new InternalServerError('Error reading CSV file'));
          });
      })
      .catch((error) =>
        reject(new InternalServerError('Error fetching existing products'))
      );
  });
};
