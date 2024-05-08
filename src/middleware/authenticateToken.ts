// src/middleware/authenticateToken.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, decoded: any) => {
        if (err) {
            return res.sendStatus(403); // Forbidden - invalid token
        }

        try {
            const user = await AppDataSource.getRepository(User).findOneBy({ id: decoded.userId });
            if (!user) {
                return res.sendStatus(403); // No user found with this ID
            }
            req.user = {
                ...user,
                id: user.id 
            };
            next();
        } catch (error) {
            console.error("Error fetching user:", error);
            res.sendStatus(500);
        }
    });
}
