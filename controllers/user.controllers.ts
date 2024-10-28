import { Request, Response, NextFunction } from 'express';
import { getNewTokens, loginUser, registerNewUser } from '../services';
import { Unauthorized } from '../middleware/errorHandler';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await registerNewUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUser(email, password);

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const refreshUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new Unauthorized('Refresh token not found');
    }

    const { newAccessToken, newRefreshToken } = await getNewTokens(refreshToken);

    res.cookie('accessToken', newAccessToken, { httpOnly: true });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

    res.status(200).json({ newAccessToken, newRefreshToken });
  } catch (error) {
    next(error);
  }
};