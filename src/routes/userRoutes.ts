import { Request, Response, Router } from 'express';
import { createUser } from '../controllers/userController';

const router = Router();

//Rota de exemplo
router.get('/users', (req, res) => {
  res.json({ message: 'Rota de usuários funcionando!' });
});

router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await createUser(name, email);
    
    res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

export default router;
