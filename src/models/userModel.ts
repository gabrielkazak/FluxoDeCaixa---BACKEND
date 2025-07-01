import prisma from '../database/prisma';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

type RoleType = 'admin' | 'user'; 

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

    await prisma.log.create({
      data: {
        action: 'CREATE',
        entity: 'USER',
        entityId: user.id,
        before: Prisma.DbNull,
        after: JSON.parse(JSON.stringify(user)),
        userId: user.id,
      },
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async login({ email, password }: LoginData) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('Usuário não encontrado.');

    if (user.blockedUntil && user.blockedUntil > new Date()) {
      throw new Error('Usuário bloqueado. Tente novamente mais tarde.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { loginTries: { increment: 1 } },
      });

      if (updatedUser.loginTries >= 5) {
        await prisma.user.update({
          where: { email },
          data: {
            blockedUntil: new Date(Date.now() + 15 * 60 * 1000),
            loginTries: 0,
          },
        });

        throw new Error('Usuário bloqueado por muitas tentativas. Tente mais tarde.');
      }

      throw new Error('Senha inválida.');
    }

    await prisma.user.update({
      where: { email },
      data: { loginTries: 0, blockedUntil: null },
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async findById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  },

  async findEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  },

  async getAll() {
    return await prisma.user.findMany();
  },

  async testForUser() {
    return await prisma.user.findFirst();
  },

  async update(
    id: number,
    name: string,
    email: string,
    password: string | undefined,
    role: RoleType
  ) {
    const before = await prisma.user.findUnique({ where: { id } });

    const dataToUpdate: any = { name, email, role };

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 12);
      dataToUpdate.password = hashedPassword;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE',
        entity: 'USER',
        entityId: id,
        before: before ? JSON.parse(JSON.stringify(before)) : Prisma.DbNull,
        after: JSON.parse(JSON.stringify(updated)),
        userId: id,
      },
    });

    return updated;
  },

  async delete(id: number) {
    const before = await prisma.user.findUnique({ where: { id } });

    const deleted = await prisma.user.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'DELETE',
        entity: 'USER',
        entityId: id,
        before: before ? JSON.parse(JSON.stringify(before)) : Prisma.DbNull,
        after: Prisma.DbNull,
        userId: id,
      },
    });

    return deleted;
  },

  async resetPassword({
    email,
    newPassword,
  }: {
    email: string;
    newPassword: string;
  }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('Usuário não encontrado.');

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updated = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE',
        entity: 'USER',
        entityId: updated.id,
        before: JSON.parse(JSON.stringify(user)),
        after: JSON.parse(JSON.stringify(updated)),
        userId: updated.id,
      },
    });

    return { message: 'Senha atualizada com sucesso.' };
  },

  async insertToken(email: string, resetPasswordToken: string, resetTokenExpiry: Date) {
    const before = await prisma.user.findUnique({ where: { email } });

    const user = await prisma.user.update({
      where: { email },
      data: { resetPasswordToken, resetTokenExpiry },
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE',
        entity: 'USER',
        entityId: user.id,
        before: before ? JSON.parse(JSON.stringify(before)) : Prisma.DbNull,
        after: JSON.parse(JSON.stringify(user)),
        userId: user.id,
      },
    });

    return user;
  },

  async checkForToken(token: string) {
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user) throw new Error('Token inválido.');
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new Error('Token expirado.');
    }

    return user;
  },

  async expireToken(email: string) {
    const before = await prisma.user.findUnique({ where: { email } });

    const user = await prisma.user.update({
      where: { email },
      data: { resetPasswordToken: null, resetTokenExpiry: null },
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE',
        entity: 'USER',
        entityId: user.id,
        before: before ? JSON.parse(JSON.stringify(before)) : Prisma.DbNull,
        after: JSON.parse(JSON.stringify(user)),
        userId: user.id,
      },
    });

    return user;
  },
};

export default userModel;
