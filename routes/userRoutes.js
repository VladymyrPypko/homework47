import { Router } from 'express';
import { registerUser } from '../services/index.js';
import { validateRegister } from '../middleware/validateRegister.js';

const router = Router();

router.post('/register', validateRegister, registerUser);

export default router;
