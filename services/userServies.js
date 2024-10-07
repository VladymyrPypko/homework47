import { randomUUID } from 'crypto';
import { users } from '../storage/storage.js';
import { BadRequest } from '../middleware/errorHandler.js';

export const registerUser = (req, res, next) => {
  try {
    const { email, name, password } = req.body;

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

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    next(error);
  }
};
