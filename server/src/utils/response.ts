// src/utils/response.mts

import { Response } from "express";

export const sendErrorResponse = (
  res: Response,
  status: number,
  message: string,
) => {
  res.status(status).json({ success: false, message });
};

export const sendSuccessResponse = (res: Response, data: any) => {
  res.json({ success: true, data });
};
