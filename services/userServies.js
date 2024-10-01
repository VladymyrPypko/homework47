import { randomUUID } from 'crypto';
import { users } from '../storage.js';
import { validateEmail, validatePassword } from '../utils/credentialsSchema.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Email is not correct' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password is not correct' });
    }

    const newUser = { id: randomUUID(), name, email, password };
    users.push(newUser);

    res.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error: ', error });
  }
};
