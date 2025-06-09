import prisma from '../database/prisma';
import { TipoMovimentacao, ClassificacaoMovimentacao } from '@prisma/client';

interface FlowData {
  idUsuario: number;
  tipo: TipoMovimentacao;
  classificacao: ClassificacaoMovimentacao;
  valor: number;
  saldo: number;
  dataMovimentacao: Date;
  descricao?: string;
}


const flowModel = {
  async getAllByUserId(idUsuario: number) {
    return await prisma.fluxoCaixa.findMany({
      where: { idUsuario },
    });
  },

  async getById(id: number) {
    return await prisma.fluxoCaixa.findUnique({
      where: { id },
    });
  },

  async create({ idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao,}: FlowData) {
    return await prisma.fluxoCaixa.create({
      data: {
        idUsuario,
        tipo,
        classificacao,
        valor,
        saldo,
        dataMovimentacao,
        descricao,
      },
    });
  },

  async update(id: number,{ idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao,}: FlowData) {
    return await prisma.fluxoCaixa.update({
      where: { id },
      data: {
        idUsuario,
        tipo,
        classificacao,
        valor,
        saldo,
        dataMovimentacao,
        descricao,
      },
    });
  },

  async delete(id: number) {
    return await prisma.fluxoCaixa.delete({
      where: { id },
    });
  },
};

export default flowModel;
