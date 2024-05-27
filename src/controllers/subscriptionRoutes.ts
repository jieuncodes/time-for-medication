// src/controllers/subscriptionRoutes.ts
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';

const router = Router();

const sendErrorResponse = (res: Response, status: number, message: string): void => {
    res.status(status).json({ success: false, message });
};


router.post('/save-subscription',
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('subscription').notEmpty().withMessage('Subscription must not be empty').isLength({ max: 1000 }),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, 'Validation failed');
        }

        const { userId, subscription } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.subscription = subscription;
            await userRepository.save(user);
            res.status(200).json({ message: 'Subscription saved successfully' });
        } catch (error) {
            console.error('Error saving subscription:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

export default router;
