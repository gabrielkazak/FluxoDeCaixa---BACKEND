import request from 'supertest';
import app from '../index';
import prisma from '../database/prisma';
import userModel from '../models/userModel';
import { RoleType } from '@prisma/client'; // Importe RoleType se ainda não o fez no seu arquivo de teste

describe('RecPasswordController', () => {
  let userEmail = 'recpass@email.com';

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        name: 'RecPass User',
        email: userEmail,
        password: await require('bcrypt').hash('senha123', 12),
        role: 'user'
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: userEmail } });
    await prisma.$disconnect();
  });

  it('deve retornar erro se email não for enviado', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({});
    expect(res.status).toBe(400);
  });

  it('deve iniciar processo de recuperação de senha', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: userEmail });
    expect([200, 201]).toContain(res.status);
  });

  it('deve retornar erro ao enviar email para usuário inexistente', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'naoexiste@email.com' });
    expect(res.status).toBe(404);
  });

  it('deve retornar erro ao verificar token ausente', async () => {
    const res = await request(app).get('/api/auth/reset-password');
    expect(res.status).toBe(400);
  });

  it('deve retornar erro ao resetar senha sem token', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({ newPassword: 'senha12345' });
    expect(res.status).toBe(400);
  });

  it('deve retornar erro ao resetar senha curta', async () => {
    const res = await request(app).post('/api/auth/reset-password?token=abc').send({ newPassword: '123' });
    expect(res.status).toBe(400);
  });

  it('deve resetar a senha com sucesso', async () => {
    const token = 'tokenvalido';
    const newPassword = 'senha12345';

    // Mock da verificação do token
    jest.spyOn(userModel, 'checkForToken').mockResolvedValueOnce({
      id: 1,
      name: 'RecPass User',
      email: 'recpass@email.com',
      password: 'senha123',
      role: 'user',
      resetPasswordToken: token,
      resetTokenExpiry: new Date(Date.now() + 1000000),
      loginTries: 0,
      blockedUntil: null
    });

    const res = await request(app)
      .post(`/api/auth/reset-password?token=${token}`)
      .send({ newPassword });
    expect(res.status).toBe(200);
  });

  // Para testar reset de senha e verify-token, você pode mockar o token ou buscar no banco após o teste acima.
});

describe('RecPasswordController - branches extras', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve retornar 400 se token não for enviado em verifyToken', async () => {
    const res = await request(app).get('/api/auth/reset-password');
    expect(res.status).toBe(400);
  });

  it('deve retornar 400 se token for inválido em verifyToken', async () => {
    jest.spyOn(userModel, 'checkForToken').mockResolvedValueOnce(null as any);
    const res = await request(app).get('/api/auth/reset-password?token=tokeninvalido');
    expect(res.status).toBe(400);
  });

  it('deve retornar 500 se checkForToken lançar erro em verifyToken', async () => {
    jest.spyOn(userModel, 'checkForToken').mockRejectedValueOnce(new Error('Erro'));
    const res = await request(app).get('/api/auth/reset-password?token=tokeninvalido');
    expect(res.status).toBe(500);
  });

  it('deve retornar 400 se token não for enviado em resetPassword', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({ newPassword: 'senha12345' });
    expect(res.status).toBe(400);
  });

  it('deve retornar 400 se nova senha não for enviada em resetPassword', async () => {
    const res = await request(app).post('/api/auth/reset-password?token=abc').send({});
    expect(res.status).toBe(400);
  });

  it('deve retornar 400 se nova senha for curta em resetPassword', async () => {
    const res = await request(app).post('/api/auth/reset-password?token=abc').send({ newPassword: '123' });
    expect(res.status).toBe(400);
  });

  it('deve retornar 400 se token for inválido em resetPassword', async () => {
    jest.spyOn(userModel, 'checkForToken').mockResolvedValueOnce(null as any);
    const res = await request(app).post('/api/auth/reset-password?token=tokeninvalido').send({ newPassword: 'senha12345' });
    expect(res.status).toBe(400);
  });

  it('deve retornar 500 se checkForToken lançar erro em resetPassword', async () => {
    jest.spyOn(userModel, 'checkForToken').mockRejectedValueOnce(new Error('Erro'));
    const res = await request(app).post('/api/auth/reset-password?token=tokeninvalido').send({ newPassword: 'senha12345' });
    expect(res.status).toBe(500);
  });

  it('deve retornar 500 se resetPassword lançar erro', async () => {
    jest.spyOn(userModel, 'checkForToken').mockResolvedValueOnce({
      id: 1,
      name: 'RecPass User',
      email: 'recpass@email.com',
      password: 'senha123',
      role: 'user',
      resetPasswordToken: 'tokenvalido',
      resetTokenExpiry: new Date(Date.now() + 1000000),
      loginTries: 0,
      blockedUntil: null
    });
    jest.spyOn(userModel, 'resetPassword').mockRejectedValueOnce(new Error('Erro'));
    const res = await request(app).post('/api/auth/reset-password?token=tokenvalido').send({ newPassword: 'senha12345' });
    expect(res.status).toBe(500);
  });

  it('deve retornar 500 se expireToken lançar erro', async () => {
    jest.spyOn(userModel, 'checkForToken').mockResolvedValueOnce({
      id: 1,
      name: 'RecPass User',
      email: 'recpass@email.com',
      password: 'senha123',
      role: 'user',
      resetPasswordToken: 'tokenvalido',
      resetTokenExpiry: new Date(Date.now() + 1000000),
      loginTries: 0,
      blockedUntil: null
    });
    jest.spyOn(userModel, 'resetPassword').mockResolvedValueOnce({ message: 'Senha resetada com sucesso' });
    jest.spyOn(userModel, 'expireToken').mockRejectedValueOnce(new Error('Erro'));
    const res = await request(app).post('/api/auth/reset-password?token=tokenvalido').send({ newPassword: 'senha12345' });
    expect(res.status).toBe(500);
  });
it('deve retornar erro se usuário não encontrado', async () => {
  // Mocka prisma.user.update para rejeitar com um erro quando o usuário não é encontrado
  // Isso simula o cenário em que o Prisma não consegue encontrar o usuário para atualizar.
  (prisma.user.update as jest.Mock).mockRejectedValue(new Error('Usuário não encontrado'));

  // Acomodando o teste para a assinatura original de userModel.update:
  // (id: number, name: string, email: string, password: string, role: RoleType)
  // Fornecemos valores "dummy" para os campos que não são o foco do teste,
  // mas que são exigidos pela função.
  const dummyId = 1;
  const newName = 'Novo Nome';
  const dummyEmail = 'teste@example.com'; // Email fictício
  const dummyPassword = 'senhaSegura123'; // Senha fictícia
  const dummyRole = RoleType.user; // Ou RoleType.ADMIN, dependendo do seu caso

  // Agora, a chamada à função userModel.update está de acordo com a sua assinatura original.
  await expect(userModel.update(dummyId, newName, dummyEmail, dummyPassword, dummyRole)).rejects.toThrow('Usuário não encontrado');
});

  it('deve retornar erro se usuário não encontrado ao deletar', async () => {
    (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Usuário não encontrado'));
    await expect(userModel.delete(1)).rejects.toThrow('Usuário não encontrado');
  });
});