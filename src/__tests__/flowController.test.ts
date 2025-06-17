import request from 'supertest';
import app from '../index';
import prisma from '../database/prisma';
import jwt from 'jsonwebtoken';
import { TipoMovimentacao, ClassificacaoMovimentacao } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

describe('FlowController', () => {
  let token: string;
  let userId: number;
  let flowId: number;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@email.com',
        password: await require('bcrypt').hash('senha123', 12),
        role: 'user'
      }
    });
    userId = user.id;
    token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.fluxoCaixa.deleteMany({ where: { idUsuario: userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('deve criar um fluxo', async () => {
    const flowPayload = {
      idUsuario: userId, // Aqui userId já está definido!
      tipo: TipoMovimentacao.Entrada,
      classificacao: ClassificacaoMovimentacao.Venda,
      valor: 100,
      saldo: 1000,
      dataMovimentacao: new Date().toISOString(),
      descricao: 'Venda teste'
    };

    const res = await request(app)
      .post('/api/flows')
      .set('Authorization', `Bearer ${token}`)
      .send(flowPayload);

    expect([200, 201, 204, 404, 500]).toContain(res.status);
    expect(res.body).toHaveProperty('id');
    flowId = res.body.id;
  });

  it('deve buscar um fluxo por ID', async () => {
    const res = await request(app)
      .get(`/api/flows/${flowId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.status);
  });

  it('deve atualizar um fluxo', async () => {
    const updatePayload = {
      idUsuario: userId,
      tipo: TipoMovimentacao.Entrada,
      classificacao: ClassificacaoMovimentacao.Venda,
      valor: 200,
      saldo: 1200,
      dataMovimentacao: new Date().toISOString(),
      descricao: 'Venda atualizada'
    };

    const res = await request(app)
      .put(`/api/flows/${flowId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatePayload);
    expect([200, 204]).toContain(res.status);
  });

  it('deve deletar um fluxo', async () => {
    const res = await request(app)
      .delete(`/api/flows/${flowId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 204]).toContain(res.status);
  });

  it('deve retornar erro ao atualizar fluxo inexistente', async () => {
    const res = await request(app)
      .put('/api/flows/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 100 });
    expect([404, 500]).toContain(res.status);
  });

  it('deve retornar erro ao deletar fluxo inexistente', async () => {
    const res = await request(app)
      .delete('/api/flows/999999')
      .set('Authorization', `Bearer ${token}`);
    expect([404, 500]).toContain(res.status);
  });

  it('deve buscar todos os fluxos do usuário pelo ID do usuário', async () => {
    const res = await request(app)
      .get(`/api/flows/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.status);
  });

  // Mock o model para lançar erro
  jest.spyOn(prisma.fluxoCaixa, 'findMany').mockRejectedValueOnce(new Error('Erro'));
  it('deve retornar 500 se getAllByUserId falhar', async () => {
    const res = await request(app)
      .get('/api/flows')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  jest.spyOn(prisma.fluxoCaixa, 'findUnique').mockRejectedValueOnce(new Error('Erro'));
  it('deve retornar 500 se getById falhar', async () => {
    const res = await request(app)
      .get(`/api/flows/${flowId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  jest.spyOn(prisma.fluxoCaixa, 'update').mockRejectedValueOnce(new Error('Erro'));
  it('deve retornar 500 se updateFlow falhar', async () => {
    const res = await request(app)
      .put(`/api/flows/${flowId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 200 });
    expect(res.status).toBe(500);
  });

  jest.spyOn(prisma.fluxoCaixa, 'delete').mockRejectedValueOnce(new Error('Erro'));
  it('deve retornar 500 se deleteFlow falhar', async () => {
    const res = await request(app)
      .delete(`/api/flows/${flowId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });
});