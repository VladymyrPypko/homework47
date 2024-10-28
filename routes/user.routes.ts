import { Router, Request, Response, NextFunction } from 'express';
import { validateRegister } from '../middleware/validateRegister';
import { login, refreshUserToken, registerUser } from '../controllers';

const router = Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', login)
router.get('/refresh-token', refreshUserToken)

export default router;
