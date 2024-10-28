import { Request, Response, NextFunction } from 'express';
import { Forbidden } from './errorHandler';

export const checkUserPermissions = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.userRole && roles.includes(req.userRole)) {
        next();
      } else {
        throw new Forbidden(`Don't have permission to perform this action`);
      }
    } catch (error) {
      next(error);
    }
  };
};