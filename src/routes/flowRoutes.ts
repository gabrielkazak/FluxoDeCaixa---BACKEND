import { Router } from 'express';
import { 
  getAllFlowsByUserId,
  getFlowById,
  createFlow,
  updateFlow,
  deleteFlow
} from '../controllers/flowController';

const router = Router();

// Buscar todas as movimentações de um usuário
router.get('/flows/user/:id', getAllFlowsByUserId); // GET /flows/user/id testada

// Buscar uma movimentação específica
router.get('/flows/:id', getFlowById); // GET /flows/id testada

// Criar nova movimentação
router.post('/flows', createFlow); // POST /flows testada

// Atualizar movimentação existente
router.put('/flows/:id', updateFlow); // PUT /flows/id testada

// Deletar movimentação
router.delete('/flows/:id', deleteFlow); // DELETE /flows/id testada

export default router;
