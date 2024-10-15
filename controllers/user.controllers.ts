import { Request, Response, NextFunction } from 'express';
import { registerNewUser } from '../services';

export const registerUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = registerNewUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
