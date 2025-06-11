import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/users', authMiddleware, roleMiddleware, getAllUsers); 
router.put('/users/:id', authMiddleware, updateUser); 
router.delete('/users/:id', authMiddleware, deleteUser); 

export default router;
