import prisma from '../database/prisma';

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
    return await prisma.fluxoCaixa.findMany({
      where: { idUsuario },
    });
  },

  async getById(id: number) {
    return await prisma.fluxoCaixa.findUnique({
      where: { id },
    });
  },

  async getByDate(dataMovimentacao: Date) {
    const startOfDay = new Date(
      Date.UTC(
        dataMovimentacao.getUTCFullYear(),
        dataMovimentacao.getUTCMonth(),
        dataMovimentacao.getUTCDate(),
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        dataMovimentacao.getUTCFullYear(),
        dataMovimentacao.getUTCMonth(),
        dataMovimentacao.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

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

  async create({
    idUsuario,
    tipo,
    classificacao,
    valor,
    formaPagamento,
    dataMovimentacao,
    descricao,
  }: FlowData) {
    return await prisma.fluxoCaixa.create({
      data: {
        idUsuario,
        tipo,
        classificacao,
        valor,
        formaPagamento,
        dataMovimentacao,
        descricao,
      },
    });
  },

  async update(
    id: number,
    {
      idUsuario,
      tipo,
      classificacao,
      valor,
      formaPagamento,
      dataMovimentacao,
      descricao,
      alterado,
    }: FlowData
  ) {
    return await prisma.fluxoCaixa.update({
      where: { id },
      data: {
        idUsuario,
        tipo,
        classificacao,
        valor,
        formaPagamento,
        dataMovimentacao,
        descricao,
        alterado,
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
