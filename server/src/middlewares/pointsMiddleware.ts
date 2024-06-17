// src/middlewares/pointsMiddleware.ts

import { Response, NextFunction } from "express";
import { AppDataSource } from "../data-source.ts";
import { User } from "../models/User.ts";
import { PointsRequest } from "../types/requests.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import config from "../config.ts";

export const POINTS_CONFIG = {
  REGISTER: config.pointsRegister,
  LOGIN: config.pointsLogin,
  CREATE_MEDICATION: config.pointsCreateMedication,
  UPDATE_MEDICATION: config.pointsUpdateMedication,
  DELETE_MEDICATION: config.pointsDeleteMedication,
};

export const updatePoints = asyncHandler(
  async (req: PointsRequest, res: Response, next: NextFunction) => {
    const { user, activityType } = req;

    if (!user?.id || !activityType) {
      return next();
    }
    const userRepository = AppDataSource.getRepository(User);
    const userEntity = await userRepository.findOneBy({ id: user.id });

    const pointsToAdd = POINTS_CONFIG[activityType] ?? 0;

    if (
      activityType === "LOGIN" &&
      userEntity?.lastLoginDate === userEntity?.lastLoginPoint
    ) {
      console.log("login points already given today");
      return next();
    }

    console.log(
      `User ID: ${user.id}, Activity: ${activityType}, Points to Add: ${pointsToAdd}`,
    );

    if (pointsToAdd !== 0 && userEntity) {
      if (activityType === "LOGIN") {
        userEntity.lastLoginPoint = new Date();
      }
      userEntity.points += pointsToAdd;
      try {
        await userRepository.save(userEntity);
      } catch (error) {
        console.error("Error updating user points:", error);
        return next(error);
      }
    }

    next();
  },
);
