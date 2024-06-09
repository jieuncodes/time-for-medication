// src/routes/medicationRoutes.mts
import { Router, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source.mts";
import { Medication } from "../models/Medication.mts";
import { authenticateToken } from "../middlewares/authenticateToken.mts";
import { updatePoints } from "../middlewares/pointsMiddleware.mts";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.mts";
import {
  idParamValidation,
  medicationValidation,
} from "../utils/validation.mts";
import { MedicationRequest } from "../types/requests.mts";
import { asyncHandler } from "../utils/asyncHandler.mts";

const router = Router();
const medicationRepository = AppDataSource.getRepository(Medication);

// Middleware to authenticate the token and attach user to req
router.use(authenticateToken);

// POST: Add a new medication
router.post(
  "/",
  medicationValidation,
  asyncHandler<MedicationRequest>(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Validation failed");
    }

    const { name, dosage, frequency, nextAlarm } = req.body;
    const medication = medicationRepository.create({
      name,
      dosage,
      frequency,
      nextAlarm: new Date(nextAlarm),
      user: req.user,
    });

    await medicationRepository.save(medication);
    req.body.medication = medication;
    req.activityType = "CREATE_MEDICATION";
    next();
  }),
  updatePoints,
  (req: MedicationRequest, res: Response) => {
    sendSuccessResponse(res, req.body.medication);
  },
);

// GET: Retrieve all medications for the logged-in user
router.get(
  "/",
  asyncHandler<MedicationRequest>(async (req, res) => {
    const medications = await medicationRepository.find({
      where: { user: { id: req.user!.id } },
    });
    sendSuccessResponse(res, medications);
  }),
);

// PUT: Update a medication
router.put(
  "/:id",
  idParamValidation,
  medicationValidation,
  asyncHandler<MedicationRequest>(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Validation failed");
    }

    const { id } = req.params;
    const { name, dosage, frequency, nextAlarm, active } = req.body;

    const medication = await medicationRepository.findOneBy({
      id: parseInt(id),
      user: { id: req.user!.id },
    });

    if (!medication) {
      return sendErrorResponse(res, 404, "Medication not found");
    }

    Object.assign(medication, {
      name,
      dosage,
      frequency,
      nextAlarm: nextAlarm ? new Date(nextAlarm) : medication.nextAlarm,
      active: active ?? medication.active,
    });

    await medicationRepository.save(medication);
    req.body.medication = medication;
    req.activityType = "UPDATE_MEDICATION";
    next();
  }),
  updatePoints,
  (req: MedicationRequest, res: Response) => {
    sendSuccessResponse(res, req.body.medication);
  },
);

// DELETE: Remove a medication
router.delete(
  "/:id",
  idParamValidation,
  asyncHandler<MedicationRequest>(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Validation failed");
    }

    const { id } = req.params;

    const result = await medicationRepository.delete({
      id: parseInt(id),
      user: { id: req.user!.id },
    });

    if (result.affected === 0) {
      return sendErrorResponse(res, 404, "Medication not found");
    }
    req.activityType = "DELETE_MEDICATION";
    next();
  }),
  updatePoints,
  (req: MedicationRequest, res: Response) => {
    res.status(204).send();
  },
);

export default router;
