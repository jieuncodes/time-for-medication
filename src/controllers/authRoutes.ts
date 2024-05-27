// src/controllers/authRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { updatePoints } from '../middlewares/pointsMiddleware';

const router = Router();

// Utility to sign JWT
const signToken = (userId: number): string => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error('Missing ACCESS_TOKEN_SECRET');
    }
    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

const sendErrorResponse = (res: Response, status: number, message: string) => {
    res.status(status).json({ success: false, message });
};

// POST: Register a user
router.post('/register',
    body('username')
        .isLength({ min: 6, max: 30 })
        .withMessage('Username must be between 6 and 30 characters long')
        .matches(/^\w+$/)
        .withMessage('Username must contain only letters, numbers, and underscores'),
    body('password')
        .isStrongPassword()
        .withMessage('Password must meet the strength requirements')
        .isLength({ min: 10, max: 30 })
        .withMessage('Password must be between 10 and 30 characters long'),
    body('fcmToken').optional().isString().isLength({ max: 200 }),
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
    }, updatePoints, (req, res) => {
        res.status(201).json({ success: true, message: 'User registered' });
    });

// POST: Login a user
router.post('/login',
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .matches(/^\w+$/)
        .isLength({ max: 30 })
        .withMessage('Username must contain only letters, numbers, and underscores'),
    body('password').notEmpty().withMessage('Password is required').isLength({ max: 100 }),
    body('fcmToken').optional().isString().isLength({ max: 200 }),
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
    }, updatePoints, (req, res) => {
        res.json({ success: true, accessToken: req.body.token, userId: req.user!.id });
    });

export default router;
