import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers); //Testado
router.put('/users/:id', updateUser); //Testado
router.delete('/users/:id', deleteUser); //Testado

export default router;
