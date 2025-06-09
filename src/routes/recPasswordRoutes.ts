import { Router } from 'express';
import { sendRecoveryEmail, resetPassword, verifyToken } from '../controllers/recPasswordController';

const router = Router();

router.post('/auth/forgot-password', sendRecoveryEmail); // Testado
router.post('/auth/reset-password', resetPassword); //Testado
router.get('/auth/reset-password', verifyToken); // Testado

export default router;