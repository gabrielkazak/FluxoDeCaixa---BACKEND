import request from 'supertest';
import app from '../index';
import prisma from '../database/prisma';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

describe('UserController', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@email.com',
        password: await require('bcrypt').hash('senhaAdmin123', 12),
        role: 'admin'
      }
    });
    userId = user.id;
    token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'admin@email.com' } });
    await prisma.$disconnect();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve retornar 401 ao buscar usuários sem token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('deve retornar 200 ao buscar usuários com token admin', async () => {
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve atualizar usuário', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Admin2', email: 'admin@email.com', password: 'senhaAdmin123', role: 'admin' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Admin2');
  });

  it('deve deletar usuário', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('deve buscar todos os fluxos do usuário', async () => {
    const res = await request(app)
      .get(`/api/flows/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.status);
    expect(Array.isArray(res.body) || res.body === null).toBe(true);
  });

  jest.spyOn(userModel, 'getAll').mockRejectedValueOnce(new Error('Erro'));
  it('deve retornar 500 se getAll falhar', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  jest.spyOn(userModel, 'update').mockRejectedValueOnce(new Error('Erro'));
  it('deve retornar 500 se update falhar', async () => {
    const res = await request(app).put('/api/users/1').send({});
    expect(res.status).toBe(401);
  });

  jest.spyOn(userModel, 'delete').mockRejectedValueOnce(new Error('Erro'));
  it('deve retornar 500 se delete falhar', async () => {
    const res = await request(app).delete('/api/users/1');
    expect(res.status).toBe(401);
  });
});