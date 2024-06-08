// src/utils/validation.mts

import { body, param } from 'express-validator';

export const emailValidation = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
];

export const passwordValidation = [
    body('password')
        .isStrongPassword()
        .withMessage('Password must meet the strength requirements')
        .isLength({ min: 10, max: 30 })
        .withMessage('Password must be between 10 and 30 characters long')
];

export const fcmTokenValidation = [
    body('fcmToken').optional().isString().isLength({ max: 200 })
];

export const idParamValidation = [
    param('id').isInt().withMessage('ID must be an integer')
];

export const medicationValidation = [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('dosage').notEmpty().withMessage('Dosage is required').isLength({ max: 100 }),
    body('frequency').notEmpty().withMessage('Frequency is required').isLength({ max: 100 }),
    body('nextAlarm').isISO8601().withMessage('Next alarm must be a valid ISO8601 date')
];
