// src/routes/medicationRoutes.ts
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator';
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

const sendErrorResponse = (res: Response, status: number, message: string) => {
    res.status(status).json({ success: false, message });
};


// POST: Add a new medication
router.post('/',
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('dosage').notEmpty().withMessage('Dosage is required').isLength({ max: 100 }),
    body('frequency').notEmpty().withMessage('Frequency is required').isLength({ max: 100 }),
    body('nextAlarm').isISO8601().withMessage('Next alarm must be a valid ISO8601 date'),
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
router.put('/:id',
    param('id').isInt().withMessage('Medication ID must be an integer'),
    body('name').optional().notEmpty().withMessage('Name must not be empty').isLength({ max: 100 }),
    body('dosage').optional().notEmpty().withMessage('Dosage must not be empty').isLength({ max: 100 }),
    body('frequency').optional().notEmpty().withMessage('Frequency must not be empty').isLength({ max: 100 }),
    body('nextAlarm').optional().isISO8601().withMessage('Next alarm must be a valid ISO8601 date'),
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
    }), updatePoints, (req, res) => {
        res.json(req.body.medication);
    });


// DELETE: Remove a medication
router.delete('/:id',
    param('id').isInt().withMessage('Medication ID must be an integer'),
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
    }), updatePoints, (req, res) => {
        res.status(204).send();
    });

export default router;
