import { check } from "express-validator";
import User from "../models/User.js";

export const userValidator = [
    check('name').notEmpty().withMessage('Name is required.'),
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password must be at least 8 character'),
    check('email').custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
            throw new Error('Email already in use.');
        }
    }),
    check('name').custom(async (value) => {
        const name = await User.findOne({where: {name: value } });
        if (name) {
            throw new Error('Name already in use.');
        }
    }),
    check('description').notEmpty().withMessage('Description is required')
]