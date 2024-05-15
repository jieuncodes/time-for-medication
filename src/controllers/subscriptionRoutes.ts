// src/controllers/subscriptionRoutes.ts
import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';

const router = Router();

router.post('/save-subscription', async (req: Request, res: Response) => {
    const { userId, subscription } = req.body;
    
    if (!userId || !subscription) {
        return res.status(400).json({ message: "User ID and subscription must be provided" });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.subscription = subscription;
        await userRepository.save(user);
        res.status(200).json({ message: "Subscription saved successfully" });
    } catch (error) {
        console.error("Error saving subscription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
