import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', register); //Testado
router.post('/login', login);//Testado

export default router;
