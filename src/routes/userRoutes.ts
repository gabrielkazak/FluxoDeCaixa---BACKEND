import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
