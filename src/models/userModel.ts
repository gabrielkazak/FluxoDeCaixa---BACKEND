import prisma from '../database/prisma';
import bcrypt from 'bcrypt';

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

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async login({ email, password }: LoginData) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

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
        throw new Error(
          'Usuário bloqueado por muitas tentativas de login. Tente novamente mais tarde.'
        );
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

  async update(
    id: number,
    name: string,
    email: string,
    password: string | undefined,
    role: RoleType
  ) {
    const dataToUpdate: any = { name, email, role };

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 12);
      dataToUpdate.password = hashedPassword;
    }

    return await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  },

  async delete(id: number) {
    return await prisma.user.delete({ where: { id } });
  },

  async resetPassword({
    email,
    newPassword,
  }: {
    email: string;
    newPassword: string;
  }) {
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

  async insertToken(
    email: string,
    resetPasswordToken: string,
    resetTokenExpiry: Date
  ) {
    const user = await prisma.user.update({
      where: { email },
      data: { resetPasswordToken, resetTokenExpiry },
    });
    return user;
  },

  async checkForToken(token: string) {
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

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
  },
};

export default userModel;
