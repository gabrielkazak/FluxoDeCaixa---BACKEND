import prisma from '../database/prisma';
import { Prisma } from '@prisma/client';

type ClassificacaoMovimentacao = 'Venda' | 'Compra' | 'Investimento' | 'PrestacaoServico' | 'GastoFixo';
type FormaPagamento = 'Dinheiro' | 'Cartao' | 'Pix';
type TipoMovimentacao = 'Entrada' | 'Saida';

interface FlowData {
  idUsuario: number;
  tipo: TipoMovimentacao;
  classificacao: ClassificacaoMovimentacao;
  valor: number;
  formaPagamento: FormaPagamento;
  dataMovimentacao: Date;
  descricao?: string;
  alterado?: string;
}

const flowModel = {
  async getAllFlows() {
    return await prisma.fluxoCaixa.findMany();
  },

  async getAllByUserId(idUsuario: number) {
    return await prisma.fluxoCaixa.findMany({ where: { idUsuario } });
  },

  async getById(id: number) {
    return await prisma.fluxoCaixa.findUnique({ where: { id } });
  },

  async getByDate(dataMovimentacao: Date) {
    const startOfDay = new Date(Date.UTC(dataMovimentacao.getUTCFullYear(), dataMovimentacao.getUTCMonth(), dataMovimentacao.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(dataMovimentacao.getUTCFullYear(), dataMovimentacao.getUTCMonth(), dataMovimentacao.getUTCDate(), 23, 59, 59, 999));

    return await prisma.fluxoCaixa.findMany({
      where: {
        dataMovimentacao: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  },

  async getBalance() {
    return await prisma.saldoAtual.findFirst({ orderBy: { data: 'desc' } });
  },

  async getAllBalance() {
    return await prisma.saldoAtual.findMany();
  },

  async create(data: FlowData) {
    const created = await prisma.fluxoCaixa.create({ data });

    await prisma.log.create({
      data: {
        action: 'CREATE',
        entity: 'FLUXO_CAIXA',
        entityId: created.id,
        before: Prisma.DbNull,
        after: JSON.parse(JSON.stringify(created)),
        userId: data.idUsuario,
      },
    });

    return created;
  },

  async update(id: number, data: FlowData) {
    const before = await prisma.fluxoCaixa.findUnique({ where: { id } });

    const updated = await prisma.fluxoCaixa.update({
      where: { id },
      data,
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE',
        entity: 'FLUXO_CAIXA',
        entityId: id,
        before: before ? JSON.parse(JSON.stringify(before)) : Prisma.DbNull,
        after: JSON.parse(JSON.stringify(updated)),
        userId: data.idUsuario,
      },
    });

    return updated;
  },

  async delete(id: number) {
    const before = await prisma.fluxoCaixa.findUnique({ where: { id } });

    const deleted = await prisma.fluxoCaixa.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'DELETE',
        entity: 'FLUXO_CAIXA',
        entityId: id,
        before: before ? JSON.parse(JSON.stringify(before)) : Prisma.DbNull,
        after: Prisma.DbNull,
        userId: before?.idUsuario ?? null,
      },
    });

    return deleted;
  },
};

export default flowModel;
