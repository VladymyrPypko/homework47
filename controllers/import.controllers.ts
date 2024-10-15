import { InternalServerError } from '../middleware/errorHandler';
import { Product } from '../models';
import { importProductsFromCSVService } from '../services/import.services';

export const importProductsFromCSV = async (csvFilePath: string): Promise<Product[]> => {
  try {
    return await importProductsFromCSVService(csvFilePath);
  } catch (error) {
    throw new InternalServerError('Error importing products from CSV');
  }
};
