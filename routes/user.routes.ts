import { Router, Request, Response, NextFunction } from 'express';
import { validateRegister } from '../middleware/validateRegister';
import { registerUser } from '../controllers';

const router = Router();

router.post('/register', validateRegister, registerUser);

export default router;
