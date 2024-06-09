import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.mts";
import { User } from "../models/User.mts";
import { sendErrorResponse } from "../utils/response.mts";
import config from "../config.mts";
import { AuthRequest } from "../types/requests.mts";

const verifyToken = (token: string): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.accessTokenSecret as string, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 401, "Unauthorized");
  }

  try {
    const decoded = await verifyToken(token);
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: decoded.userId,
    });
    if (!user) {
      return sendErrorResponse(res, 403, "No user found");
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    sendErrorResponse(res, 403, "Invalid or expired token");
  }
}
