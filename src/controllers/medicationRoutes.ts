// src/routes/medicationRoutes.ts
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { AppDataSource } from '../data-source';
import { Medication } from '../models/Medication';
import { User } from '../models/User';
import { authenticateToken } from '../middlewares/authenticateToken';
import { updatePoints } from '../middlewares/pointsMiddleware';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response';
import { idParamValidation, medicationValidation } from '../utils/validation';


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
router.post('/',
    medicationValidation,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, 'Validation failed');
        }

        const { name, dosage, frequency, nextAlarm } = req.body;
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
    }), updatePoints, (req: Request, res: Response) => {
        sendSuccessResponse(res, req.body.medication);
    });

// GET: Retrieve all medications for the logged-in user
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const medicationRepository = AppDataSource.getRepository(Medication);
    const medications = await medicationRepository.find({
        where: { user: { id: req.user!.id } }
    });
    sendSuccessResponse(res, medications);
}));

// PUT: Update a medication
router.put('/:id',
    idParamValidation,
    medicationValidation,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            sendErrorResponse(res, 400, 'Validation failed');
            return;
        }

        const { id } = req.params;
        const { name, dosage, frequency, nextAlarm, active } = req.body;

        const medicationRepository = AppDataSource.getRepository(Medication);
        const medication = await medicationRepository.findOneBy({
            id: parseInt(id),
            user: { id: req.user!.id }
        });

        if (!medication) {
            res.status(404).json({ message: 'Medication not found' });
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
    }), updatePoints, (req: Request, res: Response) => {
        sendSuccessResponse(res, req.body.medication);
    });

// DELETE: Remove a medication
router.delete('/:id',
    idParamValidation,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            sendErrorResponse(res, 400, 'Validation failed');
            return;
        }

        const { id } = req.params;

        const medicationRepository = AppDataSource.getRepository(Medication);
        const result = await medicationRepository.delete({ id: parseInt(id), user: { id: req.user!.id } });

        if (result.affected === 0) {
            res.status(404).json({ message: 'Medication not found' });
            return;
        }
        req.activityType = 'DELETE_MEDICATION';
        next();
    }), updatePoints, (req: Request, res: Response) => {
        res.status(204).send();
    });

export default router;
