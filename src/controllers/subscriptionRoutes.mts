// src/controllers/subscriptionRoutes.mts
import { Router, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { AppDataSource } from '../data-source.mts';
import { User } from '../models/User.mts';
import { SubscriptionRequest } from '../types/requests.mts';

const router = Router();

const sendErrorResponse = (res: Response, status: number, message: string): void => {
    res.status(status).json({ success: false, message });
};

// Helper function to handle async operations and errors correctly
const asyncHandler = (fn: (req: SubscriptionRequest, res: Response, next: NextFunction) => Promise<void | Response<any>>): RequestHandler =>
    (req, res, next) => {
        fn(req, res, next).catch(next);
    };

router.post('/save-subscription',
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('subscription').notEmpty().withMessage('Subscription must not be empty').isLength({ max: 1000 }),
    asyncHandler(async (req: SubscriptionRequest, res: Response, next: NextFunction) => {
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
            return res.status(200).json({ message: 'Subscription saved successfully' });
        } catch (error) {
            console.error('Error saving subscription:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }));

export default router;
