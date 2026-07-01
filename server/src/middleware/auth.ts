import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_manifesto_token_key_123!';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export async function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user as any).role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro de validação de administrador' });
  }
}
