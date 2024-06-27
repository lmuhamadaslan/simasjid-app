import { check, validationResult } from 'express-validator';

export const roleValidator = [
    check('name').notEmpty().withMessage('Name is required.'),
]