import { Router } from 'express';
import {
  getAllFlows,
  getAllFlowsByUserId,
  getFlowById,
  getBalance,
  getAllBalance,
  getAllFlowByDate,
  createFlow,
  updateFlow,
  deleteFlow,
} from '../controllers/flowController';

import { updateBalanceMiddleware } from '../middlewares/flowMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Retorna o saldo da conta e do caixa
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saldoConta:
 *                   type: number
 *                   example: 1520.75
 *                 saldoCaixa:
 *                   type: number
 *                   example: 430.50
 *       500:
 *         description: Erro ao buscar saldo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar saldo.
 *                 detalhes:
 *                   type: string
 *                   example: Erro detalhado
 */
router.get('/balance', authMiddleware, getBalance);

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Retorna o historico do saldo da conta e do caixa
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saldoConta:
 *                   type: number
 *                   example: 1520.75
 *                 saldoCaixa:
 *                   type: number
 *                   example: 430.50
 *       500:
 *         description: Erro ao buscar saldo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar saldo.
 *                 detalhes:
 *                   type: string
 *                   example: Erro detalhado
 */
router.get('/balance/all', authMiddleware, getAllBalance);

/**
 * @swagger
 * /flows/all:
 *   get:
 *     summary: Retorna todas as movimentações cadastradas
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimentações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   idUsuario:
 *                     type: integer
 *                     example: 9
 *                   tipo:
 *                     type: string
 *                     example: Receita
 *                   classificacao:
 *                     type: string
 *                     example: Venda
 *                   valor:
 *                     type: number
 *                     example: 250.00
 *                   formaPagamento:
 *                     type: string
 *                     example: Cartão
 *                   dataMovimentacao:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-22T14:30:00Z
 *                   descricao:
 *                     type: string
 *                     example: Venda de produto X
 *                   alterado:
 *                     type: string
 *                     example: null
 *       500:
 *         description: Erro ao buscar movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar movimentações.
 */
router.get('/flows/all', authMiddleware, getAllFlows);

/**
 * @swagger
 * /flows/user/{id}:
 *   get:
 *     summary: Retorna todas as movimentações de um usuário específico
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *           example: 9
 *     responses:
 *       200:
 *         description: Lista de movimentações do usuário retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   idUsuario:
 *                     type: integer
 *                     example: 9
 *                   tipo:
 *                     type: string
 *                     example: Receita
 *                   classificacao:
 *                     type: string
 *                     example: Venda
 *                   valor:
 *                     type: number
 *                     example: 250.00
 *                   formaPagamento:
 *                     type: string
 *                     example: Cartão
 *                   dataMovimentacao:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-22T14:30:00Z
 *                   descricao:
 *                     type: string
 *                     example: Venda de produto X
 *                   alterado:
 *                     type: string
 *                     example: null
 *       500:
 *         description: Erro ao buscar movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar movimentações.
 */
router.get('/flows/user/:id', authMiddleware, getAllFlowsByUserId);

/**
 * @swagger
 * /flows/{id}:
 *   get:
 *     summary: Retorna uma movimentação específica pelo ID
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da movimentação
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Movimentação retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 idUsuario:
 *                   type: integer
 *                   example: 9
 *                 tipo:
 *                   type: string
 *                   example: Despesa
 *                 classificacao:
 *                   type: string
 *                   example: Compra
 *                 valor:
 *                   type: number
 *                   example: 150.00
 *                 formaPagamento:
 *                   type: string
 *                   example: Dinheiro
 *                 dataMovimentacao:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-20T10:15:00Z
 *                 descricao:
 *                   type: string
 *                   example: Compra de material de escritório
 *                 alterado:
 *                   type: string
 *                   example: null
 *       500:
 *         description: Erro ao buscar movimentação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar movimentação.
 */
router.get('/flows/:id', authMiddleware, getFlowById);

/**
 * @swagger
 * /flows/data/{data}:
 *   get:
 *     summary: Retorna todas as movimentações de uma data específica
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: data
 *         required: true
 *         description: Data no formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-22
 *     responses:
 *       200:
 *         description: Lista de movimentações da data retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   idUsuario:
 *                     type: integer
 *                     example: 9
 *                   tipo:
 *                     type: string
 *                     example: Receita
 *                   classificacao:
 *                     type: string
 *                     example: Venda
 *                   valor:
 *                     type: number
 *                     example: 250.00
 *                   formaPagamento:
 *                     type: string
 *                     example: Cartão
 *                   dataMovimentacao:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-22T14:30:00Z
 *                   descricao:
 *                     type: string
 *                     example: Venda de produto X
 *                   alterado:
 *                     type: string
 *                     example: null
 *       500:
 *         description: Erro ao buscar movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar movimentações.
 */
router.get('/flows/data/:data', authMiddleware, getAllFlowByDate);

/**
 * @swagger
 * /flows:
 *   post:
 *     summary: Cria uma nova movimentação
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *               - tipo
 *               - classificacao
 *               - valor
 *               - formaPagamento
 *               - dataMovimentacao
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 example: 9
 *               tipo:
 *                 type: string
 *                 example: Receita
 *               classificacao:
 *                 type: string
 *                 example: Venda
 *               valor:
 *                 type: number
 *                 example: 150.00
 *               formaPagamento:
 *                 type: string
 *                 example: Cartão
 *               dataMovimentacao:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-22T14:30:00Z
 *               descricao:
 *                 type: string
 *                 example: Venda de produto X
 *     responses:
 *       200:
 *         description: Movimentação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 idUsuario:
 *                   type: integer
 *                   example: 9
 *                 tipo:
 *                   type: string
 *                   example: Receita
 *                 classificacao:
 *                   type: string
 *                   example: Venda
 *                 valor:
 *                   type: number
 *                   example: 150.00
 *                 formaPagamento:
 *                   type: string
 *                   example: Cartão
 *                 dataMovimentacao:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-22T14:30:00Z
 *                 descricao:
 *                   type: string
 *                   example: Venda de produto X
 *       500:
 *         description: Erro ao criar movimentação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao criar movimentação.
 */
router.post('/flows', authMiddleware, updateBalanceMiddleware, createFlow);

/**
 * @swagger
 * /flows/{id}:
 *   put:
 *     summary: Atualiza uma movimentação existente pelo ID
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da movimentação a ser atualizada
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *               - tipo
 *               - classificacao
 *               - valor
 *               - formaPagamento
 *               - dataMovimentacao
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 example: 9
 *               tipo:
 *                 type: string
 *                 example: Despesa
 *               classificacao:
 *                 type: string
 *                 example: Compra
 *               valor:
 *                 type: number
 *                 example: 150.00
 *               formaPagamento:
 *                 type: string
 *                 example: Dinheiro
 *               dataMovimentacao:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-22T14:30:00Z
 *               descricao:
 *                 type: string
 *                 example: Compra de material de escritório
 *     responses:
 *       200:
 *         description: Movimentação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 idUsuario:
 *                   type: integer
 *                   example: 9
 *                 tipo:
 *                   type: string
 *                   example: Despesa
 *                 classificacao:
 *                   type: string
 *                   example: Compra
 *                 valor:
 *                   type: number
 *                   example: 150.00
 *                 formaPagamento:
 *                   type: string
 *                   example: Dinheiro
 *                 dataMovimentacao:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-06-22T14:30:00Z
 *                 descricao:
 *                   type: string
 *                   example: Compra de material de escritório
 *                 alterado:
 *                   type: string
 *                   example: Sim
 *       404:
 *         description: Movimentação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Movimentação não encontrada.
 *       500:
 *         description: Erro ao atualizar movimentação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao atualizar movimentação.
 */
router.put('/flows/:id', authMiddleware, updateFlow);

/**
 * @swagger
 * /flows/{id}:
 *   delete:
 *     summary: Deleta uma movimentação pelo ID
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da movimentação a ser deletada
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Movimentação deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movimentação deletada com sucesso.
 *                 deletada:
 *                   type: object
 *                   description: Dados da movimentação deletada
 *       500:
 *         description: Erro ao deletar movimentação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao deletar movimentação.
 */
router.delete('/flows/:id', authMiddleware, deleteFlow);

export default router;
