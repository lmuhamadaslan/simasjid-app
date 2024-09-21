import { check, validationResult } from "express-validator";

export const loginValidator = [
    check('email').notEmpty().withMessage('Email is required.'),
    check('password').notEmpty().withMessage('Password is required.'),
]

export const resultValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/auth/login', { errors: errors.array(), formData: req.body, errorMessage: req.flash('error') });
    }
    next();
}