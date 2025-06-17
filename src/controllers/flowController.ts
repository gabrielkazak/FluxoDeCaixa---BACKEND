import { Request, Response } from 'express';
import flowModel from '../models/flowModel';
import { updateBalanceAfterEdit } from '../middlewares/updateFlowMiddleware';

// Buscar todas as movimentações de um usuário
export const getAllFlowsByUserId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const flows = await flowModel.getAllByUserId(id);
    res.json(flows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar movimentações.' });
  }
};

// Buscar movimentação específica
export const getFlowById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const flow = await flowModel.getById(id);
    res.json(flow);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar movimentação.' });
  }
};

export const getAllFlowByDate = async (req: Request, res: Response) => {
  const data = new Date(req.params.data);
  try {
    const flow = await flowModel.getByDate(data);
    res.json(flow);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar movimentações.' });
  }
};

// Criar movimentação
export const createFlow = async (req: Request, res: Response) => {
  const { idUsuario, tipo, classificacao, valor, formaPagamento, dataMovimentacao, descricao } = req.body;
  try {
    const novaMov = await flowModel.create({
      idUsuario,
      tipo,
      classificacao,
      valor,
      formaPagamento,
      dataMovimentacao: new Date(dataMovimentacao),
      descricao,
    });
    res.json(novaMov);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar movimentação.' });
  }
};


// Atualizar movimentação com correção de saldo
export const updateFlow = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { idUsuario, tipo, classificacao, valor, formaPagamento, dataMovimentacao, descricao } = req.body;

  try {
    const movimentacaoAntiga = await flowModel.getById(id);
    if (!movimentacaoAntiga) {
      res.status(404).json({ error: 'Movimentação não encontrada.' });
      return;
    }

    const atualizada = await flowModel.update(id, {
      idUsuario,
      tipo,
      classificacao,
      valor,
      formaPagamento,
      dataMovimentacao: new Date(dataMovimentacao),
      descricao,
    });

    await updateBalanceAfterEdit(movimentacaoAntiga, atualizada);

    res.json(atualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar movimentação.' });
  }
};



// Deletar movimentação
export const deleteFlow = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const deletada = await flowModel.delete(id);
    res.json({ message: 'Movimentação deletada com sucesso.', deletada });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar movimentação.' });
  }
};
