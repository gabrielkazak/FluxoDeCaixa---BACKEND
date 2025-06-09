import { Request, Response } from 'express';
import userModel from '../models/userModel';

// Buscar todos os usuários
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// Atualizar usuário
export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, password, role } = req.body;

  try {
    const updatedUser = await userModel.update(id, name, email, password, role);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
};

// Deletar usuário
export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const deletedUser = await userModel.delete(id);
    res.json({ message: 'Usuário deletado com sucesso.', deletedUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
};
