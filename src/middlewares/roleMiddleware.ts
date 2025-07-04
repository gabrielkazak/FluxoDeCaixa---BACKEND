import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface User {
      role: string;
    }
    interface Request {
      user?: User;
      isFirstUser?: boolean;
    }
  }
}

export const roleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (req.isFirstUser) {
    return next();
  }

  const user = req.user;

  if (!user || user.role !== 'admin') {
    res.status(403).json({ message: 'Acesso restrito a administradores.' });
    return;
  }

  next();
};
