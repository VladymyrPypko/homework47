import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { users } from '../storage/storage';
import { BadRequest, Unauthorized } from '../middleware/errorHandler';
import { APP_ROLES, User } from '../models';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../.env.production')
    : path.join(__dirname, '../.env.development');

dotenv.config({ path: envFilePath });

export const registerNewUser = async ({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}): Promise<void> => {
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new BadRequest('User already exists');
  }

  const hash = await bcrypt.hash(password, 12);

  const newUser: User = {
    id: randomUUID(),
    email,
    name,
    passwordHash: hash,
    role: APP_ROLES.Customer,
  };

  users.push(newUser);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user: User | undefined = users.find((user) => user.email === email);

  if (!user) {
    throw new Unauthorized('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Unauthorized();
  }

  const accessKey = process.env.ACCESS_SECRET;
  const refreshKey = process.env.REFRESH_SECRET;

  const accessToken: string = jwt.sign(
    { role: user.role },
    accessKey as string,
    { expiresIn: '1h' }
  );

  const refreshToken: string = jwt.sign({}, refreshKey as string, {
    expiresIn: '2 days',
  });

  return { accessToken, refreshToken };
};

export const getNewTokens = async (token: string): Promise<{ newAccessToken: string; newRefreshToken: string }> => {
  const accessKey = process.env.ACCESS_SECRET as string;
  const refreshKey = process.env.REFRESH_SECRET as string;

  try {
    const decodedData = jwt.verify(token, refreshKey) as { id: string };
    const user = users.find((user) => user.id === decodedData.id);

    if (!user) {
      throw new Unauthorized('User not found');
    }

    const newAccessToken: string = jwt.sign(
      { id: user.id, role: user.role },
      accessKey,
      { expiresIn: '1h' }
    );

    const newRefreshToken: string = jwt.sign({ id: user.id }, refreshKey, {
      expiresIn: '2 days',
    });

    return { newAccessToken, newRefreshToken };
  } catch (error) {
    throw new Unauthorized('Invalid refresh token');
  }
};
