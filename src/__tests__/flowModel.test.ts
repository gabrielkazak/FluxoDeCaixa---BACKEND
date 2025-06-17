import flowModel from '../models/flowModel';
import prisma from '../database/prisma';
import { Prisma, TipoMovimentacao, ClassificacaoMovimentacao } from '@prisma/client';

jest.mock('../database/prisma', () => ({
  fluxoCaixa: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
}));

describe('flowModel', () => {
  const mockFlow = {
    id: 1,
    idUsuario: 1,
    tipo: TipoMovimentacao.Entrada,
    classificacao: 'Venda',
    valor: 100,
    saldo: 1000,
    dataMovimentacao: new Date(),
    descricao: 'Teste'
  };

  const mockFlowCreate = {
    idUsuario: 1,
    tipo: TipoMovimentacao.Entrada,
    classificacao: ClassificacaoMovimentacao.Venda,
    valor: 100,
    saldo: 1000,
    dataMovimentacao: new Date(),
    descricao: 'Teste'
  };

  it('getAllByUserId deve retornar lista de fluxos', async () => {
    (prisma.fluxoCaixa.findMany as jest.Mock).mockResolvedValue([mockFlow]);
    const result = await flowModel.getAllByUserId(1);
    expect(result).toEqual([mockFlow]);
    expect(prisma.fluxoCaixa.findMany).toHaveBeenCalledWith({ where: { idUsuario: 1 } });
  });

  it('getById deve retornar um fluxo', async () => {
    (prisma.fluxoCaixa.findUnique as jest.Mock).mockResolvedValue(mockFlow);
    const result = await flowModel.getById(1);
    expect(result).toEqual(mockFlow);
    expect(prisma.fluxoCaixa.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('create deve criar um fluxo', async () => {
    (prisma.fluxoCaixa.create as jest.Mock).mockResolvedValue({ id: 1, ...mockFlowCreate });
    const result = await flowModel.create(mockFlowCreate);
    expect(result).toEqual({ id: 1, ...mockFlowCreate });
    expect(prisma.fluxoCaixa.create).toHaveBeenCalled();
  });

  it('update deve atualizar um fluxo', async () => {
    const mockFlowUpdate = { ...mockFlowCreate, valor: 200 };
    (prisma.fluxoCaixa.update as jest.Mock).mockResolvedValue({ id: 1, ...mockFlowUpdate });
    const result = await flowModel.update(1, mockFlowUpdate);
    expect(result.valor).toBe(200);
    expect(prisma.fluxoCaixa.update).toHaveBeenCalled();
  });

  it('delete deve deletar um fluxo', async () => {
    (prisma.fluxoCaixa.delete as jest.Mock).mockResolvedValue(mockFlow);
    const result = await flowModel.delete(1);
    expect(result).toEqual(mockFlow);
    expect(prisma.fluxoCaixa.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});