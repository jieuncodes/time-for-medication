// src/routes/medicationRoutes.ts
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { AppDataSource } from '../data-source';
import { Medication } from '../entities/Medication';
import { User } from '../entities/User';
import { authenticateToken } from '../middleware/authenticateToken';
import { updatePoints } from '../middleware/pointsMiddleware';

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
        return next();
    }

    if (!req.user || req.user.id === undefined) { 
        res.status(403).json({ message: "Invalid user data" });
        return next();
    }

    const medication = new Medication();
    medication.name = name;
    medication.dosage = dosage;
    medication.frequency = frequency;
    medication.nextAlarm = new Date(nextAlarm);
    medication.user = req.user as User; 

    const medicationRepository = AppDataSource.getRepository(Medication);
    await medicationRepository.save(medication);
    res.status(201).json(medication);
    next();
}), updatePoints);

// GET: Retrieve all medications for the logged-in user
router.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const medicationRepository = AppDataSource.getRepository(Medication);
    const medications = await medicationRepository.find({
        where: { user: { id: req.user!.id } }  // Correcting how the user is referenced
    });
    res.json(medications);
    next();
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
        return next();
    }

    medication.name = name || medication.name;
    medication.dosage = dosage || medication.dosage;
    medication.frequency = frequency || medication.frequency;
    medication.nextAlarm = nextAlarm ? new Date(nextAlarm) : medication.nextAlarm;
    medication.active = active !== undefined ? active : medication.active;

    await medicationRepository.save(medication);
    res.json(medication);
    next();
}), updatePoints);

// DELETE: Remove a medication
router.delete('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const medicationRepository = AppDataSource.getRepository(Medication);
    const result = await medicationRepository.delete({ id: parseInt(id), user: { id: req.user!.id } });

    if (result.affected === 0) {
        res.status(404).json({ message: "Medication not found" });
        return next();
    }
    res.status(204).send();
    next();
}), updatePoints);

export default router;
