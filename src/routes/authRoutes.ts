import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/auth/register', register); //Testado
router.post('/auth/login', login);//Testado

export default router;
