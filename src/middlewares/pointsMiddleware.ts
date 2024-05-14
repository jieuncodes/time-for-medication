// src/middleware/pointsMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';

const POINTS_CONFIG = {
    REGISTER: parseInt(process.env.POINTS_REGISTER ?? '0'),
    LOGIN: parseInt(process.env.POINTS_LOGIN ?? '0'),
    CREATE_MEDICATION: parseInt(process.env.POINTS_CREATE_MEDICATION ?? '0'),
    UPDATE_MEDICATION: parseInt(process.env.POINTS_UPDATE_MEDICATION ?? '0'),
    DELETE_MEDICATION: parseInt(process.env.POINTS_DELETE_MEDICATION ?? '0')
};



const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export const updatePoints = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user, activityType } = req;

    if (!user || !activityType) {
        console.log("Required user or activityType information is missing.");
        console.log(`${user}, ${String(activityType)}`)
        return next();
    }

    const pointsToAdd = POINTS_CONFIG[activityType as keyof typeof POINTS_CONFIG] ?? 0;

    if (pointsToAdd != 0) {
        console.log(`Attempting to add ${pointsToAdd} points to user ${user.id}`);
        const userRepository = AppDataSource.getRepository(User);
        const userEntity = await userRepository.findOneBy({ id: user.id });
        if (userEntity) {
            userEntity.points += pointsToAdd;
            await userRepository.save(userEntity);
            console.log(`Updated points for user ${user.username}: ${userEntity.points}`);
        } else {
            console.log("User not found in database");
        }
    }

    next();
});
