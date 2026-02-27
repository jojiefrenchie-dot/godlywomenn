import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

export interface JWTPayload {
  id: number;
  email: string;
}

export function generateTokens(id: number, email: string) {
  const accessToken = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id, email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  (req as any).user = payload;
  next();
}
