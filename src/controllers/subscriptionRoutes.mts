// src/controllers/subscriptionRoutes.mts
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { AppDataSource } from "../data-source.mts";
import { User } from "../models/User.mts";
import { SubscriptionRequest } from "../types/requests.mts";
import { asyncHandler } from "../utils/asyncHandler.mts";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.mts";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.post(
  "/save-subscription",
  body("userId").isInt().withMessage("User ID must be an integer"),
  body("subscription")
    .notEmpty()
    .withMessage("Subscription must not be empty")
    .isLength({ max: 1000 }),
  asyncHandler<SubscriptionRequest>(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Validation failed");
    }

    const { userId, subscription } = req.body;

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    user.subscription = subscription;
    await userRepository.save(user);
    return sendSuccessResponse(res, "Subscription saved successfully");
  }),
);

export default router;
