import { Request, Response } from 'express';
import userModel from '../models/userModel';
import { RoleType } from '@prisma/client';

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


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if(!email || !password){
    res.status(400).json({message:"Informações Faltantes"});
    return
  }

  try {
    const user = await userModel.login({ email, password });

    res.status(200).json({ message: 'Login bem-sucedido!', user });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};
