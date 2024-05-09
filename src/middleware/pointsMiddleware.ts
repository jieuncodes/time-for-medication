// src/middleware/pointsMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

// Async handler to simplify error handling in middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export const updatePoints = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!user) {
        console.log("No user attached to request");
        return next();
    }

    let pointsToAdd = 0;
    switch (req.method) {
        case 'POST':
            pointsToAdd = 100;
            break;
        case 'PUT':
            pointsToAdd = 10;
            break;
        case 'DELETE':
            pointsToAdd = 1;
            console.log("DELETE CASE: Attempting to add 1 point");
            break;
    }

    if (pointsToAdd > 0) {
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
