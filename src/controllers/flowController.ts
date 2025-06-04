import prisma from '../database/prisma'
import { TipoMovimentacao, ClassificacaoMovimentacao } from '@prisma/client';

//Busca todas as movimentações baseadas no id
export const getAllFlowsByID = async (id: number) => {
  return await prisma.fluxoCaixa.findMany({
    where: { idUsuario: id }
  })
}

//Busca uma movimentação específica pelo id
export const getFlowByID = async (id: number) => {
  return await prisma.fluxoCaixa.findUnique({
    where: { id:id }
  })
}

//Cria uma movimentação
export const createFlow = async (
  idUsuario:number,
  tipo:TipoMovimentacao,
  classificacao:ClassificacaoMovimentacao,
  valor:number,
  saldo:number,
  dataMovimentacao:Date,
  descricao?:string ) =>{
  return await prisma.fluxoCaixa.create({
    data:{ idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao }
  })
};

//Atualiza uma movimentação
export const updateFlow = async (
  id: number,
  idUsuario: number,
  tipo: TipoMovimentacao,
  classificacao: ClassificacaoMovimentacao,
  valor: number,
  saldo: number,
  dataMovimentacao: Date,
  descricao?: string
) => {
  return await prisma.fluxoCaixa.update({
    where: { id },
    data: { idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao }
  });
};

//Deleta uma movimentação
export const deleteFlow = async (id: number) => {
  return await prisma.fluxoCaixa.delete({
    where: { id: id }
  })
}
