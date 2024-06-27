import { check } from 'express-validator';

export const permissionValidator = [
    check('name').notEmpty().withMessage('Name is required.'),
]