import request from 'supertest';
import app from '../index';
import prisma from '../database/prisma';

describe('AuthController', () => {
  beforeAll(async () => {
    // Cria um usuário real para testar login de sucesso
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@email.com',
        password: await require('bcrypt').hash('senhaSegura123', 12),
        role: 'user'
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'testuser@email.com' } });
    await prisma.$disconnect();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve retornar erro se faltar email ou senha', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('deve retornar erro se senha estiver errada', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'testuser@email.com', password: 'errada' });
    expect(res.status).toBe(401);
  });

  it('deve logar com sucesso', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'testuser@email.com', password: 'senhaSegura123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toBe('testuser@email.com');
  });

  it('deve registrar usuário com sucesso', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Novo Usuário',
      email: 'novo@email.com',
      password: 'senha12345',
      role: 'user'
    });
    expect(res.body).toHaveProperty('user');
  });

  it('deve retornar erro ao registrar usuário com email já existente', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Novo Usuário',
      email: 'novo@email.com',
      password: 'senha12345',
      role: 'user'
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Novo Usuário',
      email: 'novo@email.com',
      password: 'senha12345',
      role: 'user'
    });
    expect(res.status).toBe(400);
  });

  it('deve retornar erro ao registrar usuário com senha curta', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Curto',
      email: 'curto@email.com',
      password: '123',
      role: 'user'
    });
    expect(res.status).toBe(400);
  });

  it('deve retornar erro ao registrar usuário com dados faltando', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });

  it('deve retornar erro ao fazer refresh sem token', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });

  it('deve retornar erro ao fazer refresh com token inválido', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', ['refreshToken=tokeninvalido']);
    expect(res.status).toBe(403);
  });

  it('deve fazer logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
  });

  // Teste para registro sem role (deve assumir 'user')
  it('deve registrar usuário com role padrão user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'SemRole',
      email: 'semrole@email.com',
      password: 'senha12345'
    });
    expect(res.body.user.role).toBe('user');
  });
});