// src/controllers/authRoutes.mts
import { Router, Response, NextFunction } from "express";
import { AuthRequest } from "../types/requests.ts";
import { AppDataSource } from "../data-source.ts";
import { User } from "../models/User.ts";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { updatePoints } from "../middlewares/pointsMiddleware.ts";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.ts";
import {
  emailValidation,
  passwordValidation,
  fcmTokenValidation,
  usernameValidation,
} from "../utils/validation.ts";
import { authenticateToken } from "../middlewares/authenticateToken.ts";
import config from "../config.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import crypto from "crypto";
import { Otp } from "../models/Otp.ts";

const router = Router();
const userRepository = AppDataSource.getRepository(User);
const otpRepository = AppDataSource.getRepository(Otp);

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
    const existingEmail = await userRepository.findOneBy({ email });
    const existingUsername = await userRepository.findOneBy({ username });

    if (existingEmail) {
      return sendErrorResponse(res, 400, "Email already taken");
    }

    if (existingUsername) {
      return sendErrorResponse(res, 400, "Username already taken");
    }

    const user = userRepository.create({ email, password, fcmToken, username });
    user.registerDate = new Date();
    await userRepository.save(user);

    req.user = user;
    req.activityType = "REGISTER";
    next();
  }),
  updatePoints,
  (req: AuthRequest, res: Response) => {
    sendSuccessResponse(res, "User registered");
  }
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
    if (!user) {
      return sendErrorResponse(res, 401, "User not found");
    }
    if (password && !(await bcrypt.compare(password, user.password || ""))) {
      return sendErrorResponse(res, 401, "Invalid credentials");
    }

    if (fcmToken) {
      user.fcmToken = fcmToken;
    }

    user.lastLoginDate = new Date();
    await userRepository.save(user);

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
  }
);

// POST: OAuth
router.post(
  "/oauth",
  asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, username, fcmToken, provider } = req.body;
    let isNew = false;
    let user = await userRepository.findOneBy({ email });
    if (!user) {
      user = userRepository.create({ email, fcmToken, username, provider });
      await userRepository.save(user);
      isNew = true;
    }

    req.user = user;
    req.body.token = signToken(user.id);
    req.activityType = isNew ? "REGISTER" : "LOGIN";
    next();
  }),
  updatePoints,
  (req: AuthRequest, res: Response) => {
    sendSuccessResponse(res, {
      accessToken: req.body.token,
      userId: req.user!.id,
    });
  }
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
  })
);

// POST: Check if email or username is already taken
router.post(
  "/check-duplicate",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, username } = req.body;

    if (email) {
      const existingEmail = await userRepository.findOneBy({ email });
      if (existingEmail) {
        return sendErrorResponse(res, 400, "Email already taken");
      }
      return sendSuccessResponse(res, "Email is available");
    }

    if (username) {
      const existingUsername = await userRepository.findOneBy({ username });
      if (existingUsername) {
        return sendErrorResponse(res, 400, "Username already taken");
      }
      return sendSuccessResponse(res, "Username is available");
    }

    sendErrorResponse(res, 400, "Input is required");
  })
);

// POST: Generate and store OTP
router.post(
  "/generate-otp",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return sendErrorResponse(res, 400, "Email is required");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    await otpRepository.save({ email, otp, expirationTime });

    const newOtp = otpRepository.create({
      email,
      otp,
      expirationTime,
    });

    sendSuccessResponse(res, {
      message: "OTP generated and saved successfully",
      otp: newOtp.otp,
    });
  })
);

// POST: Verify user typed OTP with the stored OTP
router.post(
  "/verify-otp",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, otp: userTypedOTP } = req.body;

    if (!email || !userTypedOTP) {
      return sendErrorResponse(res, 400, "Email and OTP are required");
    }

    const matchingEmail = await otpRepository.findOneBy({
      email,
    });

    if (!matchingEmail) {
      return sendErrorResponse(res, 400, "Email not found");
    }

    const isOTPmatch = await otpRepository.findOneBy({
      email,
      otp: userTypedOTP,
    });

    if (!isOTPmatch) {
      return sendErrorResponse(res, 400, "Wrong OTP. Please try again");
    }
    sendSuccessResponse(res, "OTP is valid");
  })
);

export default router;
