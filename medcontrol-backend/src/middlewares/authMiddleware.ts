import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email?: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email?: string;
      };
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: decoded.userId,
      email: decoded.email || undefined,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

export default authMiddleware;
