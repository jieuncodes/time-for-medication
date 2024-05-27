// src/controllers/authRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { updatePoints } from '../middlewares/pointsMiddleware';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response';
import { usernameValidation, passwordValidation, fcmTokenValidation } from '../utils/validation';

const router = Router();

// Utility to sign JWT
const signToken = (userId: number): string => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error('Missing ACCESS_TOKEN_SECRET');
    }
    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

// POST: Register a user
router.post('/register',
    [...usernameValidation, ...passwordValidation, ...fcmTokenValidation],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, 'Validation failed');
        }

        const { username, password, fcmToken } = req.body;
        try {
            const userRepository = AppDataSource.getRepository(User);
            let user = new User();
            user.username = username;
            user.password = password;
            user.fcmToken = fcmToken;
            await userRepository.save(user);

            req.user = user;
            req.activityType = 'REGISTER';
            next();
        } catch (error) {
            console.error("Registration error:", error);
            next(error);
        }
    }, updatePoints, (req: Request, res: Response) => {
        sendSuccessResponse(res, 'User registered');
    });

// POST: Login a user
router.post('/login',
    [...usernameValidation, ...passwordValidation, ...fcmTokenValidation],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, 'Validation failed');
        }

        const { username, password, fcmToken } = req.body;
        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ username });
            if (!user) {
                return sendErrorResponse(res, 401, 'Invalid credentials');
            }
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                return sendErrorResponse(res, 401, 'Invalid credentials');
            }

            if (fcmToken) {
                user.fcmToken = fcmToken;
                await userRepository.save(user);
            }

            req.user = user;
            req.body.token = signToken(user.id);
            req.activityType = 'LOGIN';
            next();
        } catch (error) {
            console.error("Login error:", error);
            next(error);
        }
    }, updatePoints, (req: Request, res: Response) => {
        sendSuccessResponse(res, { accessToken: req.body.token, userId: req.user!.id });
    });
export default router;
