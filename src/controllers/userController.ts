import { User } from '@prisma/client';
import prisma from '../database/prisma';

// Buscar todos os usuários
export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

// Buscar usuário por ID
export const getUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

// Criar novo usuário
export const createUser = async (name: string, email: string, password: string, role: string): Promise<User> => {
  return await prisma.user.create({
    data: { name, email, password, role },
  });
};

// Atualizar usuário
export const updateUser = async (id: number, name: string, email: string, password: string, role: string): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: { name, email, password, role },
  });
};

// Deletar usuário
export const deleteUser = async (id: number): Promise<User> => {
  return await prisma.user.delete({
    where: { id },
  });
};
