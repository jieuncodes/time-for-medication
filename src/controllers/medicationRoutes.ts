// src/routes/medicationRoutes.ts
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AppDataSource } from '../data-source';
import { Medication } from '../models/Medication';
import { User } from '../models/User';
import { authenticateToken } from '../middlewares/authenticateToken';
import { updatePoints } from '../middlewares/pointsMiddleware';

const router = Router();

// Middleware to authenticate the token and attach user to req
router.use(authenticateToken);

// Helper function to handle async operations and errors correctly
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
    async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };

// POST: Add a new medication
router.post('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, dosage, frequency, nextAlarm } = req.body;
    if (!name || !dosage || !frequency || !nextAlarm) {
        res.status(400).json({ message: "All fields must be provided" });
        return;
    }

    if (!req.user || req.user.id === undefined) {
        res.status(403).json({ message: "Invalid user data" });
        return;
    }

    const medication = new Medication();
    medication.name = name;
    medication.dosage = dosage;
    medication.frequency = frequency;
    medication.nextAlarm = new Date(nextAlarm);
    medication.user = req.user as User;

    const medicationRepository = AppDataSource.getRepository(Medication);
    await medicationRepository.save(medication);
    req.body.medication = medication;
    req.activityType = 'CREATE_MEDICATION';
    next();
}), updatePoints, (req, res) => {
    res.status(201).json(req.body.medication);
});

// GET: Retrieve all medications for the logged-in user
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const medicationRepository = AppDataSource.getRepository(Medication);
    const medications = await medicationRepository.find({
        where: { user: { id: req.user!.id } }
    });
    res.json(medications);
}));

// PUT: Update a medication
router.put('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, dosage, frequency, nextAlarm, active } = req.body;

    const medicationRepository = AppDataSource.getRepository(Medication);
    const medication = await medicationRepository.findOneBy({
        id: parseInt(id),
        user: { id: req.user!.id }
    });

    if (!medication) {
        res.status(404).json({ message: "Medication not found" });
        return;
    }

    medication.name = name || medication.name;
    medication.dosage = dosage || medication.dosage;
    medication.frequency = frequency || medication.frequency;
    medication.nextAlarm = nextAlarm ? new Date(nextAlarm) : medication.nextAlarm;
    medication.active = active !== undefined ? active : medication.active;

    await medicationRepository.save(medication);
    req.body.medication = medication;
    req.activityType = 'UPDATE_MEDICATION';
    next();
}), updatePoints, (req, res) => {
    res.json(req.body.medication);
});

// DELETE: Remove a medication
router.delete('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const medicationRepository = AppDataSource.getRepository(Medication);
    const result = await medicationRepository.delete({ id: parseInt(id), user: { id: req.user!.id } });

    if (result.affected === 0) {
        res.status(404).json({ message: "Medication not found" });
        return;
    }
    req.activityType = 'DELETE_MEDICATION';
    next();
}), updatePoints, (req, res) => {
    res.status(204).send();
});

export default router;
