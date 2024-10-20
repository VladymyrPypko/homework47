import { randomUUID } from 'crypto';
import { users } from '../storage/storage';
import { BadRequest } from '../middleware/errorHandler';

export const registerNewUser = ({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}): void => {
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new BadRequest('User already exists');
  }

  const newUser = {
    id: randomUUID(),
    email,
    name,
    password,
  };

  users.push(newUser);
};
