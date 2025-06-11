import { Router } from 'express';
import { sendRecoveryEmail, resetPassword, verifyToken } from '../controllers/recPasswordController';

const router = Router();

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - RecPassword
 *     summary: Envia um e-mail para recuperação de senha.
 *     description: Envia um e-mail com link contendo token para o usuário redefinir sua senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário que deseja recuperar a senha.
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: E-mail enviado com sucesso!
 *       400:
 *         description: E-mail não informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email é obrigatório
 *       404:
 *         description: Usuário não encontrado com o e-mail fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno.
 */
router.post('/auth/forgot-password', sendRecoveryEmail); // Testado

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - RecPassword
 *     summary: Redefine a senha do usuário com base no token de recuperação.
 *     description: Recebe o token na query string e a nova senha no corpo da requisição para redefinir a senha do usuário.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de recuperação enviado por e-mail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: Nova senha do usuário, deve ter no mínimo 8 dígitos.
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Senha redefinida com sucesso!
 *       400:
 *         description: Token ou nova senha faltantes ou inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token e nova senha são obrigatórios.
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno.
 */
router.post('/auth/reset-password', resetPassword); //Testado

/**
 * @swagger
 * /auth/reset-password:
 *   get:
 *     tags:
 *       - RecPassword
 *     summary: Verifica se o token de recuperação de senha é válido.
 *     description: Verifica se o token enviado na query string é válido e não expirou.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de recuperação enviado por e-mail.
 *     responses:
 *       200:
 *         description: Token válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token válido.
 *       400:
 *         description: Token inválido, expirado ou faltante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token inválido ou expirado.
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro interno.
 */
router.get('/auth/reset-password', verifyToken); // Testado

export default router;