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
        return next(); 
    }

    let pointsToAdd = 0;
    switch (req.method) {
        case 'POST':
            pointsToAdd = 10;  // adding a new medication
            break;
        case 'PUT':
            pointsToAdd = 0;   // updating a medication
            break;
        case 'DELETE':
            pointsToAdd = -10;   // deleting a medication
            break;
    }

    if (pointsToAdd > 0) {
        const userRepository = AppDataSource.getRepository(User);
        const userEntity = await userRepository.findOneBy({ id: user.id });
        if (userEntity) {
            userEntity.points += pointsToAdd;  // Update points
            await userRepository.save(userEntity);
            console.log(`Updated points for user ${user.username}: ${userEntity.points}`);
        }
    }

    next();
});

