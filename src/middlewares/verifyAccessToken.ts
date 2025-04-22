import AppError from "@/utils/AppError";
import { decodeToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";

export const verifyTokenMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return next(new AppError("Access Token not found", 401));
    token = token.replace("Bearer", "");
    const data = await decodeToken(token);
    req.user = data;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    next(new AppError("Invalid access token", 401));
  }
};
