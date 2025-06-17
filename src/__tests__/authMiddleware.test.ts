import { authMiddleware } from '../middlewares/authMiddleware';
import { Request, Response, NextFunction } from 'express';

describe('authMiddleware', () => {
  it('deve retornar 401 se não houver token', () => {
    const req = { headers: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  // Adicione mais testes para token inválido e válido
});