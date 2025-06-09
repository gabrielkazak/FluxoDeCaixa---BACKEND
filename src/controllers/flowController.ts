import { Request, Response } from 'express';
import flowModel from '../models/flowModel';

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

// Criar movimentação
export const createFlow = async (req: Request, res: Response) => {
  const { idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao } = req.body;
  try {
    const novaMov = await flowModel.create({
      idUsuario,
      tipo,
      classificacao,
      valor,
      saldo,
      dataMovimentacao: new Date(dataMovimentacao),
      descricao,
    });
    res.json(novaMov);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar movimentação.' });
  }
};


// Atualizar movimentação
export const updateFlow = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao } = req.body;
  try {
    const atualizada = await flowModel.update(id, {
      idUsuario,
      tipo,
      classificacao,
      valor,
      saldo,
      dataMovimentacao: new Date(dataMovimentacao),
      descricao,
    });
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
