// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    sendErrorResponse(res, 500, 'Internal Server Error');
}
