import { Request, Response } from 'express';
import prisma from '../database/prisma';
import userModel from '../models/userModel';

// Registro
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email já está em uso.' });
    }

    const user = await prisma.user.create({
      data: { name, email, password, role }, // senha ainda em texto simples
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    res.status(200).json({ message: 'Login bem-sucedido!', user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};
