// src/middlewares/authenticateToken.mts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.mts";
import { User } from "../models/User.mts";
import { sendErrorResponse } from "../utils/response.mts";
import config from "../config.mts";
import { AuthRequest } from "../types/requests.mts";

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 401, "Unauthorized");
  }

  jwt.verify(
    token,
    config.accessTokenSecret as string,
    async (err, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return sendErrorResponse(
            res,
            401,
            "Token has expired, please log in again."
          );
        }
        return sendErrorResponse(res, 403, "Forbidden - invalid token");
      }

      try {
        const user = await AppDataSource.getRepository(User).findOneBy({
          id: decoded.userId,
        });
        if (!user) {
          return sendErrorResponse(res, 403, "No user found with this ID");
        }
        req.user = { id: user.id, email: user.email };
        next();
      } catch (error) {
        console.error("Error fetching user:", error);
        sendErrorResponse(res, 500, "Internal Server Error");
      }
    }
  );
}
