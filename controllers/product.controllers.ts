import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { createNewProduct, getProductByIdService, getProductsFromFile } from '../services';
import { importProductsFromCSV } from './import.controllers';
import { fileUploadLogger } from '../utils/eventLogger';
import { BadRequest, InternalServerError } from '../middleware/errorHandler';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const createdProduct = await createNewProduct(req.body);

    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await getProductsFromFile();
    res.status(200).json(products);
  } catch (error) {
    next(new InternalServerError('Failed to retrieve products'));
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const product = await getProductByIdService(productId);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// выдает ошибку типизации при попытке передать req.file
export const importProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    fileUploadLogger.emit('fileUploadStart', 'File upload has started');

    if (!req.file) {
      throw new BadRequest('There is no file to import');
    }

    const csvFilePath = path.join(__dirname, '../uploads', req.file.filename);

    if (!fs.existsSync(csvFilePath)) {
      throw new BadRequest(`File not found: ${csvFilePath}`);
    }

    const importedProducts = await importProductsFromCSV(csvFilePath);

    fileUploadLogger.emit('fileUploadEnd', 'File has been uploaded');

    res.status(201).json({
      message: 'Products imported successfully',
      importedProducts,
    });
  } catch (error) {
    fileUploadLogger.emit('fileUploadFailed', `Error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);

    next(new InternalServerError(`Failed to import products: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
};
