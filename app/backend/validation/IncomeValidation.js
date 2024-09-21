import { check } from "express-validator";

export const incomeValidation = [
    check('date').notEmpty().withMessage('Date is required'),
    check('source').notEmpty().withMessage('Source is required'),
    check('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    check('description').optional()
]