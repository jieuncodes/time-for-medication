// src/middlewares/errorHandler.mts

import { Request, Response, NextFunction } from "express";
import { sendErrorResponse } from "../utils/response.mts";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });
  sendErrorResponse(res, 500, "Internal Server Error");
}
