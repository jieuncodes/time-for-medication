// src/controllers/authRoutes.mts
import { Router, Response, NextFunction } from "express";
import { AuthRequest } from "../types/requests.mts";
import { AppDataSource } from "../data-source.mts";
import { User } from "../models/User.mts";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { updatePoints } from "../middlewares/pointsMiddleware.mts";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.mts";
import {
  emailValidation,
  passwordValidation,
  fcmTokenValidation,
  usernameValidation,
} from "../utils/validation.mts";
import { authenticateToken } from "../middlewares/authenticateToken.mts";
import config from "../config.mts";
import { asyncHandler } from "../utils/asyncHandler.mts";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Utility to sign JWT
const signToken = (userId: number): string => {
  if (!config.accessTokenSecret) {
    throw new Error("Missing ACCESS_TOKEN_SECRET");
  }
  return jwt.sign({ userId }, config.accessTokenSecret, { expiresIn: "1h" });
};

// POST: Register a user
router.post(
  "/register",
  [
    ...emailValidation,
    ...passwordValidation,
    ...fcmTokenValidation,
    ...usernameValidation,
  ],
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Validation failed");
    }

    const { email, password, fcmToken, username } = req.body;
    const existingUser = await userRepository.findOneBy({ email });
    const existingUsername = await userRepository.findOneBy({ username });

    if (existingUser || existingUsername) {
      return sendErrorResponse(res, 400, "Email or Username already taken");
    }

    const user = userRepository.create({ email, password, fcmToken, username });
    await userRepository.save(user);

    req.user = user;
    req.activityType = "REGISTER";
    next();
  }),
  updatePoints,
  (req: AuthRequest, res: Response) => {
    sendSuccessResponse(res, "User registered");
  },
);

// POST: Login a user
router.post(
  "/login",
  [...emailValidation, ...passwordValidation, ...fcmTokenValidation],
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Validation failed");
    }

    const { email, password, fcmToken } = req.body;
    const user = await userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendErrorResponse(res, 401, "Invalid credentials");
    }

    if (fcmToken) {
      user.fcmToken = fcmToken;
      await userRepository.save(user);
    }

    req.user = user;
    req.body.token = signToken(user.id);
    req.activityType = "LOGIN";
    next();
  }),
  updatePoints,
  (req: AuthRequest, res: Response) => {
    sendSuccessResponse(res, {
      accessToken: req.body.token,
      userId: req.user!.id,
    });
  },
);

// DELETE: Delete a user account
router.delete(
  "/delete-account",
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await userRepository.delete({ id: req.user!.id });

    if (result.affected === 0) {
      return sendErrorResponse(res, 404, "User not found");
    }

    sendSuccessResponse(res, "User account deleted successfully");
  }),
);

export default router;
