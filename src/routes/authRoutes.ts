// src/routes/authRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source'; 
import { User } from '../entities/User';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { updatePoints } from '../middleware/pointsMiddleware';

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
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('password').isStrongPassword().withMessage('Password must meet the strength requirements'),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, 'Validation failed');
        }

        const { username, password } = req.body;
        try {
            const userRepository = AppDataSource.getRepository(User);
            let user = new User();
            user.username = username;
            user.password = password;
            await userRepository.save(user);

            req.user = user;
            req.activityType = 'REGISTER';
            next(); 
        } catch (error) {
            console.error("Registration error:", error);
            sendErrorResponse(res, 500, "Error registering user");
            return; 
        }
    }, updatePoints, (req, res) => {
        res.status(201).json({ success: true, message: 'User registered' });
    });

// POST: Login a user
router.post('/login',
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, 'Validation failed');
        }

        const { username, password } = req.body;
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

            req.user = user;
            req.body.token = signToken(user.id);
            req.activityType = 'LOGIN';
            next();  // This calls the updatePoints middleware
        } catch (error) {
            console.error("Login error:", error);
            sendErrorResponse(res, 500, "Error during login");
            return;
        }
    }, updatePoints, (req, res) => {
        res.json({ success: true, accessToken: req.body.token });
    });
export default router;
