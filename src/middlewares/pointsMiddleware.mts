// src/middlewares/pointsMiddleware.mts

import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source.mts';
import { User } from '../models/User.mts';
import config from '../config.mts';

export const POINTS_CONFIG = {
    REGISTER: config.pointsRegister,
    LOGIN: config.pointsLogin,
    CREATE_MEDICATION: config.pointsCreateMedication,
    UPDATE_MEDICATION: config.pointsUpdateMedication,
    DELETE_MEDICATION: config.pointsDeleteMedication
};


type ActivityType = keyof typeof POINTS_CONFIG;

interface PointsRequest extends Request {
    user?: {
        id: number;
    };
    activityType?: ActivityType;
}

const asyncHandler = (fn: (req: PointsRequest, res: Response, next: NextFunction) => Promise<void>) =>
    (req: PointsRequest, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export const updatePoints = asyncHandler(async (req: PointsRequest, res: Response, next: NextFunction) => {
    const { user, activityType } = req;

    if (!user?.id || !activityType) {
        return next();
    }

    const pointsToAdd = POINTS_CONFIG[activityType] ?? 0;
    console.log(`User ID: ${user.id}, Activity: ${activityType}, Points to Add: ${pointsToAdd}`);

    if (pointsToAdd !== 0) {
        const userRepository = AppDataSource.getRepository(User);
        try {
            const userEntity = await userRepository.findOneBy({ id: user.id });
            if (userEntity) {
                userEntity.points += pointsToAdd;
                await userRepository.save(userEntity);
            }
        } catch (error) {
            console.error("Error updating user points:", error);
            return next(error);
        }
    }

    next();
});

