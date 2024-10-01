import { Router } from 'express';
import { registerUser } from '../services/userServies.js';

const router = Router();

router.post('/register', registerUser);

export default router;
