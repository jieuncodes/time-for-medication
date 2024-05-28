// src/controllers/authRoutes.ts
import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/requests';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { updatePoints } from '../middlewares/pointsMiddleware';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response';
import { usernameValidation, passwordValidation, fcmTokenValidation } from '../utils/validation';
import config from '../config';

const router = Router();

// Utility to sign JWT
const signToken = (userId: number): string => {
    if (!config.accessTokenSecret) {
        throw new Error('Missing ACCESS_TOKEN_SECRET');
    }
    return jwt.sign({ userId }, config.accessTokenSecret, { expiresIn: '1h' });
};

// POST: Register a user
router.post('/register',
    [...usernameValidation, ...passwordValidation, ...fcmTokenValidation],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, 'Validation failed');
        }

        const { username, password, fcmToken } = req.body;
        try {
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOneBy({ username });
            if (existingUser) {
                return sendErrorResponse(res, 400, 'Username already taken');
            }

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
    }, updatePoints, (req: AuthRequest, res: Response) => {
        sendSuccessResponse(res, 'User registered');
    });

// POST: Login a user
router.post('/login',
    [...usernameValidation, ...passwordValidation, ...fcmTokenValidation],
    async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    }, updatePoints, (req: AuthRequest, res: Response) => {
        sendSuccessResponse(res, { accessToken: req.body.token, userId: req.user!.id });
    });

export default router;
