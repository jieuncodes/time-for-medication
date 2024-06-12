// src/utils/asyncHandler.mts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<any>,
  ): RequestHandler =>
  (req, res, next) => {
    fn(req as T, res, next).catch(next);
  };
