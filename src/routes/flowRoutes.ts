import { Router } from 'express';
import { 
  getAllFlows,
  getAllFlowsByUserId,
  getFlowById,
  getBalance,
  getAllFlowByDate,
  createFlow,
  updateFlow,
  deleteFlow
} from '../controllers/flowController';

import { updateBalanceMiddleware } from '../middlewares/flowMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();


//Buscar o saldo
router.get('/balance', authMiddleware, getBalance); //Testada

//Busca todas as movimentações
router.get('/flows/all', authMiddleware, getAllFlows) //testada

// Buscar todas as movimentações de um usuário
router.get('/flows/user/:id', authMiddleware, getAllFlowsByUserId); //testada

// Buscar uma movimentação específica
router.get('/flows/:id', authMiddleware, getFlowById); //testada

//Buscar todas as Movimentações de uma data
router.get('/flows/data/:data', authMiddleware, getAllFlowByDate); //testada

// Criar nova movimentação
router.post('/flows', authMiddleware, updateBalanceMiddleware, createFlow); //testada

// Atualizar movimentação existente
router.put('/flows/:id', authMiddleware, updateFlow); //testada

// Deletar movimentação
router.delete('/flows/:id', authMiddleware, deleteFlow); //testada

export default router;
