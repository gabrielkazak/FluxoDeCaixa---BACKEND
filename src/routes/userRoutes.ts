import { Router } from 'express';
import {
  getAllUsers,
  testForUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Busca todos os usuários (admin somente)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
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
 *                   name:
 *                     type: string
 *                     example: "Gabriel"
 *                   email:
 *                     type: string
 *                     example: "gabriel@example.com"
 *                   role:
 *                     type: string
 *                     example: "admin"
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso restrito a administradores.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/users', authMiddleware, roleMiddleware, getAllUsers);

/**
 * @swagger
 * /users/test:
 *   get:
 *     tags:
 *       - User
 *     summary: Verifica se existe algum usuário cadastrado no banco
 *     responses:
 *       200:
 *         description: Retorna se há ou não usuários cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/users/test', testForUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Atualiza os dados de um usuário pelo ID (necessário estar autenticado)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do usuário que será atualizado
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: Dados para atualização do usuário
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gabriel Atualizado"
 *               email:
 *                 type: string
 *                 example: "gabriel.updated@example.com"
 *               password:
 *                 type: string
 *                 example: "novaSenha123"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Gabriel Atualizado"
 *                 email:
 *                   type: string
 *                   example: "gabriel.updated@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: Token inválido ou não informado.
 *       500:
 *         description: Erro ao atualizar usuário.
 */
router.put('/users/:id', authMiddleware, roleMiddleware, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Deleta um usuário pelo ID (necessário estar autenticado)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do usuário que será deletado
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário deletado com sucesso."
 *                 deletedUser:
 *                   type: object
 *                   description: Dados do usuário deletado
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Gabriel"
 *                     email:
 *                       type: string
 *                       example: "gabriel@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       401:
 *         description: Token inválido ou não informado.
 *       500:
 *         description: Erro ao deletar usuário.
 */
router.delete('/users/:id', authMiddleware, roleMiddleware, deleteUser);

export default router;
