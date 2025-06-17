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
        from: 'fluxocaixa.cimol@gmail.com',
        subject: 'Redefinição de Senha do Fluxo de Caixa CIMOL',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>Recuperação de Senha</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    /* ... (coloque todo o CSS inline aqui) ... */
                    body, html { margin: 0; padding: 0; font-family: 'Inter', sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                    p { Margin: 0; padding: 0; }
                    a { text-decoration: none; color: #4CAF50; }

                    .email-body { background-color: #f4f4f4; padding: 20px; }
                    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden; }
                    .header-section { background-color: #4CAF50; padding: 30px 20px; text-align: center; color: #ffffff; }
                    .header-section h1 { margin: 0; font-size: 28px; font-weight: bold; }
                    .content-section { padding: 30px 20px; color: #333333; line-height: 1.6; font-size: 16px; }
                    .content-section h2 { font-size: 24px; color: #333333; margin-top: 0; margin-bottom: 20px; text-align: center; }
                    .button-container { text-align: center; margin-top: 25px; margin-bottom: 25px; }
                    .button { display: inline-block; background-color: #4CAF50; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 30px; border-radius: 5px; transition: background-color 0.3s ease; }
                    .footer-section { background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; }
                    .footer-section p { margin-bottom: 5px; }
                    @media screen and (max-width: 600px) {
                        .email-container { width: 100% !important; border-radius: 0 !important; }
                        .email-body { padding: 0 !important; }
                        .header-section, .content-section, .footer-section { padding: 20px !important; }
                        .header-section h1 { font-size: 24px !important; }
                        .content-section h2 { font-size: 20px !important; }
                        .button { width: 90% !important; box-sizing: border-box; }
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0" class="email-body" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center" valign="top">
                            <table cellspacing="0" cellpadding="0" border="0" class="email-container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden;">
                                <tr>
                                    <td align="center" class="header-section" style="background-color: #4CAF50; padding: 30px 20px; text-align: center; color: #ffffff;">
                                        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
                                            Fluxo de Caixa CIMOL
                                        </h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" class="content-section" style="padding: 30px 20px; color: #333333; line-height: 1.6; font-size: 16px;">
                                        <h2 style="font-size: 24px; color: #333333; margin-top: 0; margin-bottom: 20px; text-align: center;">Olá!</h2>
                                        <p style="margin-bottom: 15px;">
                                            Recebemos uma solicitação para redefinir a senha da sua conta.
                                        </p>
                                        <p style="margin-bottom: 25px;">
                                            Para continuar com a redefinição da sua senha, clique no botão abaixo:
                                        </p>
                                        <div class="button-container" style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
                                            <a href="${linkRecuperacao}" class="button" style="display: inline-block; background-color: #4CAF50; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 30px; border-radius: 5px;">
                                                Redefinir Minha Senha
                                            </a>
                                        </div>
                                        <p style="margin-bottom: 15px;">
                                            Se você não solicitou uma redefinição de senha, por favor, ignore este e-mail. Sua senha permanecerá a mesma.
                                        </p>
                                        <p>
                                            Atenciosamente,<br>
                                            Grupo Fluxo de Caixa
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" class="footer-section" style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee;">
                                        <p style="margin-bottom: 5px;">
                                            Por favor, não responda a este e-mail. Ele foi enviado automaticamente.
                                        </p>
                                        <p style="margin-bottom: 0;">
                                            Se você tiver problemas para clicar no botão, copie e cole o link abaixo em seu navegador:
                                            <br>
                                            <a href="${linkRecuperacao}" style="word-break: break-all; color: #4CAF50;">${linkRecuperacao}</a>
                                        </p>
                                        <p style="margin-top: 10px;">
                                            &copy; 2025 Fluxo de Caixa CIMOL. Todos os direitos reservados.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
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
