import prisma from '../database/prisma';
import { RoleType, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { resetPassword } from '../controllers/recPasswordController';

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

  async findEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
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

  async resetPassword({ email, newPassword }: { email: string; newPassword: string }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Senha atualizada com sucesso.' };
  },

  async insertToken(email: string, resetPasswordToken: string, resetTokenExpiry: Date) {
    const user = await prisma.user.update({
      where: { email },
      data: { resetPasswordToken, resetTokenExpiry},
    });
    return user;
  },

 async checkForToken(token: string) {
  const user = await prisma.user.findFirst({ where: { resetPasswordToken: token } });

  if (!user) {
    throw new Error('Token inválido.');
  }

  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new Error('Token expirado.');
  }

  return user;
},

  async expireToken(email: string) {
    const user = await prisma.user.update({
      where: { email },
      data: { resetPasswordToken: null, resetTokenExpiry: null },
    });
    return user;
  }

}

export default userModel;
