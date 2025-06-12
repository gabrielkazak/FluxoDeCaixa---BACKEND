import { roleMiddleware } from '../middlewares/roleMiddleware';
import { Request, Response, NextFunction } from 'express';

describe('roleMiddleware', () => {
  it('deve retornar 403 se não for admin', () => {
    const req = { user: { role: 'user' } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    roleMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('deve chamar next se for admin', () => {
    const req = { user: { role: 'admin' } } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    roleMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});