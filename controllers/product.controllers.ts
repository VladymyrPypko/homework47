import { Request, Response, NextFunction } from 'express';
import { createNewProduct, getProductByIdService, getProductsFromFile, importProductsService } from '../services';
import { InternalServerError } from '../middleware/errorHandler';

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

export const importProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const importedProducts = await importProductsService(req.file as Express.Multer.File);

    res.status(201).json({
      message: 'Products imported successfully',
      importedProducts,
    });
  } catch (error) {
    next(error);
  }
};
