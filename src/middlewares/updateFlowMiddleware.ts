import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../database/prisma';
import { TipoMovimentacao, FormaPagamento, FluxoCaixa } from '@prisma/client';

export async function updateBalanceAfterEdit(
  antigo: FluxoCaixa,
  novo: FluxoCaixa
) {
  let saldoAtual = await prisma.saldoAtual.findFirst({
    orderBy: { data: 'desc' },
  });

  if (!saldoAtual) {
    saldoAtual = await prisma.saldoAtual.create({
      data: {
        saldoConta: new Decimal(0),
        saldoCaixa: new Decimal(0),
        data: new Date(),
      },
    });
  }

  let novoSaldoConta = saldoAtual.saldoConta;
  let novoSaldoCaixa = saldoAtual.saldoCaixa;

  if (
    antigo.formaPagamento === FormaPagamento.Pix ||
    antigo.formaPagamento === FormaPagamento.Cartao
  ) {
    if (antigo.tipo === TipoMovimentacao.Entrada) {
      novoSaldoConta = novoSaldoConta.minus(new Decimal(antigo.valor));
    } else {
      novoSaldoConta = novoSaldoConta.plus(new Decimal(antigo.valor));
    }
  } else {
    if (antigo.tipo === TipoMovimentacao.Entrada) {
      novoSaldoCaixa = novoSaldoCaixa.minus(new Decimal(antigo.valor));
    } else {
      novoSaldoCaixa = novoSaldoCaixa.plus(new Decimal(antigo.valor));
    }
  }

  if (
    novo.formaPagamento === FormaPagamento.Pix ||
    novo.formaPagamento === FormaPagamento.Cartao
  ) {
    if (novo.tipo === TipoMovimentacao.Entrada) {
      novoSaldoConta = novoSaldoConta.plus(new Decimal(novo.valor));
    } else {
      novoSaldoConta = novoSaldoConta.minus(new Decimal(novo.valor));
    }
  } else {
    if (novo.tipo === TipoMovimentacao.Entrada) {
      novoSaldoCaixa = novoSaldoCaixa.plus(new Decimal(novo.valor));
    } else {
      novoSaldoCaixa = novoSaldoCaixa.minus(new Decimal(novo.valor));
    }
  }

  await prisma.saldoAtual.create({
    data: {
      saldoConta: novoSaldoConta,
      saldoCaixa: novoSaldoCaixa,
      data: new Date(),
    },
  });
}
