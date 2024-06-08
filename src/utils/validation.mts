// src/utils/validation.mts

import { body, param } from 'express-validator';

export const emailValidation = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address')
];

export const usernameValidation = [
    body('username')
        .isString()
        .isLength({ min: 6, max: 20 })
        .withMessage('Username must be between 6 and 20 characters long')
        .matches(/^\w+$/)
        .withMessage('Username can only contain letters, numbers, and underscores')
];

export const passwordValidation = [
    body('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1  
        })
        .withMessage('Password must meet the strength requirements')
        .isLength({ min: 8, max: 100 })
        .withMessage('Password must be between 8 and 100 characters long')
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
