import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
    employe?: { IdEmploye: number, MailEmploye: string, RoleEmploye: number };
  }
  
  const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies['token'];
  
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      req.employe = {
        IdEmploye: decoded.IdEmploye,
        MailEmploye: decoded.MailEmploye,
        RoleEmploye: decoded.RoleEmploye,
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  };
  
  export default authMiddleware;