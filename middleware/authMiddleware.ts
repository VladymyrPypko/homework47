import path from 'path';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Unauthorized } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../.env.production')
    : path.join(__dirname, '../.env.development');

dotenv.config({ path: envFilePath });

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userToken = req.cookies.accessToken as string;

    if (!userToken) {
      throw new Unauthorized('Unauthorized: Token not found');
    }

    const secretKey = process.env.ACCESS_SECRET as string;

    const decodedData = jwt.verify(userToken, secretKey) as JwtPayload;
    req.userRole = decodedData.role;
    next();
  } catch (error) {
    next(new Unauthorized('Unauthorized: Invalid token'));
  }
};
