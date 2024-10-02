import { randomUUID } from 'crypto';
import { users } from '../storage/storage.js';

export const registerUser = (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
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
