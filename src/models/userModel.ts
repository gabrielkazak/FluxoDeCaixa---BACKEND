import prisma from '../database/prisma';
import { RoleType, User } from '@prisma/client';
import bcrypt from 'bcrypt';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: RoleType;
}

interface LoginData {
  email: string;
  password: string;
}

const userModel = {
  async register({ name, email, password, role }: RegisterData) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },


  async login({ email, password }: LoginData) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Senha inválida.');
    }

    return { name: user.name, email: user.email, role: user.role };
  },


  async getAll() {
    return await prisma.user.findMany();
  },


  async update(id: number, name: string, email: string, password: string, role: RoleType) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return await prisma.user.update({
      where: { id },
      data: { name, email, password: hashedPassword, role },
    });
  },

  
  async delete(id: number) {
    return await prisma.user.delete({ where: { id } });
  },
};

export default userModel;
