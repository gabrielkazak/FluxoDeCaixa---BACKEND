import userModel from '../models/userModel';
import prisma from '../database/prisma';

jest.mock('../database/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  }
}));

describe('userModel', () => {
  it('register deve lançar erro se email já existe', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(userModel.register({ name: 'a', email: 'a@a.com', password: '12345678', role: 'user' }))
      .rejects
      .toThrow('Email já está em uso.');
  });

  it('register deve criar usuário se email não existe', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, name: 'a', email: 'a@a.com', role: 'user' });
    const user = await userModel.register({ name: 'a', email: 'a@a.com', password: '12345678', role: 'user' });
    expect(user).toHaveProperty('id');
  });

  it('deve lançar erro se usuário não encontrado no resetPassword', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(userModel.resetPassword({ email: 'x@x.com', newPassword: '12345678' }))
      .rejects
      .toThrow('Usuário não encontrado.');
  });
});

describe('userModel branches extras', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('update deve lançar erro se usuário não encontrado', async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue(null);
    await expect(userModel.update(1, 'a', 'a@a.com', '12345678', 'user'))
      .rejects
      .toThrow();
  });

  it('update deve lançar erro se o banco lançar erro', async () => {
    (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Erro'));
    await expect(userModel.update(1, 'a', 'a@a.com', '12345678', 'user'))
      .rejects
      .toThrow('Erro');
  });

  it('delete deve lançar erro se usuário não encontrado', async () => {
    (prisma.user.delete as jest.Mock).mockResolvedValue(null);
    await expect(userModel.delete(1)).rejects.toThrow();
  });

  it('delete deve lançar erro se o banco lançar erro', async () => {
    (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Erro'));
    await expect(userModel.delete(1)).rejects.toThrow('Erro');
  });

  it('getAll deve lançar erro se o banco lançar erro', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('Erro'));
    await expect(userModel.getAll()).rejects.toThrow('Erro');
  });
});