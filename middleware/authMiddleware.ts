import { Unauthorized } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string | undefined;

  if (!userId) {
    return next(new Unauthorized('Unauthorized: Missing x-user-id'));
  }

  req.userId = userId;
  next();
};
