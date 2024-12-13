import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { CustomRequest } from "../routes/routeDecorators";
import prisma from "../config/prisma";

export const protect = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token diperlukan",
      error: "Authorization token is required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    console.log(decoded, "decoded");

    if (!decoded) {
      return res.status(401).json({
        message: "Token tidak valid",
        error: "Invalid or expired token",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      res.status(401).json({
        message: "Pengguna tidak ditemukan",
        error: "User not found",
      });
      return;
    }

    req.user = {
      id: user.id,
    };

    next();
    return req.user?.id;
  } catch (error) {
    return res.status(401).json({
      message: "Tidak diotorisasi",
      error: error instanceof Error ? error.message : "Authentication failed",
    });
  }
};
