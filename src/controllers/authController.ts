import { Request, Response } from 'express';
import userModel from '../models/userModel';
import { RoleType } from '@prisma/client';

import jwt from 'jsonwebtoken';
import { ref } from 'process';
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'defaultrefreshsecret';

// Registro
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  if(!name || !email || !password){
    res.status(400).json({message:"Informações Faltantes"});
    return
  }

  if(password.length < 8){
    res.status(400).json({message:"Senha deve ter no mínimo 8 digitos."});
    return
  }

  const roleController: RoleType = role ?? 'user';

  try {
    const user = await userModel.register({ name, email, password, role: roleController });
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if(!email || !password){
    res.status(400).json({message:"Informações Faltantes ou Incorretas"});
    return
  }

  try {
    const user = await userModel.login({ email, password });

    // Gerar e expirar em 15 minutos
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // Refresh em 7 dias
    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true em produção (HTTPS)
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    })

    res.status(200).json({
    message: 'Login bem-sucedido!',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

// Refresh Token
export const refreshToken = (req: Request, res: Response): void => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ message: 'Refresh token não encontrado.' });
    return;
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as { id: number };

    const newAccessToken = jwt.sign(
      { id: payload.id },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Refresh token inválido ou expirado.' });
  }
};

// Logout
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({ message: 'Logout realizado com sucesso!' });
};
