// src/routes/authRoutes.ts

import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source'; 
import { User } from '../entities/User';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

// Utility to sign JWT
const signToken = (userId: number): string => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error('Missing ACCESS_TOKEN_SECRET');
    }
    return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

// User Registration Endpoint
router.post('/register',
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('password').isStrongPassword().withMessage('Password must meet the strength requirements'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            const userRepository = AppDataSource.getRepository(User);
            let user = new User();
            user.username = username;
            user.password = password;
            await userRepository.save(user);
            res.status(201).json({ message: 'User registered' });
        } catch (error) {
            console.error("Registration error:", (error as Error).message);
            res.status(500).json({ message: "Error registering user: " + (error as Error).message });
        }
    });

// User Login Endpoint
router.post('/login',
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ username });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const passwordIsValid = await bcrypt.compare(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = signToken(user.id);
            res.json({ accessToken: token });
        } catch (error) {
            console.error("Login error:", (error as Error).message);
            res.status(500).json({ message: "Error during login: " + (error as Error).message });
        }
    });

export default router;
