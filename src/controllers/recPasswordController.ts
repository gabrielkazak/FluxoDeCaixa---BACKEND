import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import userModel from '../models/userModel';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendRecoveryEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email é obrigatório' });
    return;
  }

    try {
    const userExiste = await userModel.findEmail(email);

    if (!userExiste) {
    res.status(404).json({ message: 'Usuário não encontrado.' });
    return;
    }

    
    const token = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

    await userModel.insertToken(email, token, expiryDate);

    const linkRecuperacao = `http://localhost:5173/forgot-password?token=${encodeURIComponent(token)}`;

    const msg = {
        to: email,
        from: 'gabrielkazak.info@gmail.com',
        subject: 'Recuperação de Senha',
        html: `
        <h2>Recuperação de Senha</h2>
        <p>Clique no link abaixo para redefinir sua senha.</p>
        <a href="${linkRecuperacao}">Redefinir Senha</a>
        `,
    };

    await sgMail.send(msg);
    console.log(`E-mail enviado para ${email}`);
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });

    } catch (error: any) {
    console.error('Erro ao enviar o e-mail ou processar requisição:', error.message);
    res.status(500).json({ message: error.message || 'Erro interno.' });
    }
}


export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.query.token as string;

    if (!token) {
      res.status(400).json({ message: 'Token de recuperação é obrigatório.' });
      return;
    }

    // Verifica se o token é válido e não expirou
    const tokenExiste = await userModel.checkForToken(token);

    if (!tokenExiste) {
      res.status(400).json({ message: 'Token inválido ou expirado.' });
      return;
    }
    res.status(200).json({ message: 'Token válido.' });

  } catch (error: any) {
    console.error('Erro ao redefinir ao validar token:', error.message);
    res.status(500).json({ message: error.message || 'Erro interno.' });
  }
}


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { newPassword } = req.body;
  const token = req.query.token as string;

  if (!token || !newPassword) {
    res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ message: 'Senha deve ter no mínimo 8 dígitos.' });
    return;
  }

  try {
    const user = await userModel.checkForToken(token);
    if (!user) {
      res.status(400).json({ message: 'Token inválido ou expirado.' });
      return;
    }

    await userModel.resetPassword({ email: user.email, newPassword });
    await userModel.expireToken(user.email);

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao redefinir a senha:', error.message);
    res.status(500).json({ message: error.message || 'Erro interno.' });
  }
};

