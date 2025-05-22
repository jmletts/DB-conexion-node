import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../interfaces/User"; // ruta según tu estructura

interface AuthenticatedRequest extends Request {
  user?: User;
}

const validateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Acceso no autorizado: no hay token" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "tseee"
    ) as User;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export default validateToken;
