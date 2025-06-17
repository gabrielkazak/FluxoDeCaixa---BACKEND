import prisma from '../database/prisma';
import { TipoMovimentacao, FormaPagamento } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { Request, Response, NextFunction } from 'express';

export async function updateBalanceMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { valor, tipo, formaPagamento, dataMovimentacao } = req.body;

    if (!valor || !tipo || !formaPagamento) {
      return next()
    }

    let saldoAtual = await prisma.saldoAtual.findFirst({ orderBy: { data: 'desc' } });

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

    if (formaPagamento === FormaPagamento.Pix || formaPagamento === FormaPagamento.Cartao) {
      if (tipo === TipoMovimentacao.Entrada) {
        novoSaldoConta = novoSaldoConta.plus(new Decimal(valor));
      } else {
        novoSaldoConta = novoSaldoConta.minus(new Decimal(valor));
      }
    } else {
      if (tipo === TipoMovimentacao.Entrada) {
        novoSaldoCaixa = novoSaldoCaixa.plus(new Decimal(valor));
      } else {
        novoSaldoCaixa = novoSaldoCaixa.minus(new Decimal(valor));
      }
    }

    await prisma.saldoAtual.create({
      data: {
        saldoConta: novoSaldoConta,
        saldoCaixa: novoSaldoCaixa,
        data: new Date(),
      },
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar saldo' });
  }
}

