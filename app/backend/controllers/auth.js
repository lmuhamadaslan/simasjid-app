import express from 'express';
import User from '../models/User.js';
import crypto from 'crypto';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { check, validationResult } from 'express-validator';

export const registerPage = (req, res, next) => {
    const title = 'Register';

    res.render('backend/auth/register', { title, formData: {} });
}

export const loginPage = (req, res, next) => {
    const title = 'Login';

    res.render('backend/auth/login', { title, formData: {}, errorMessage: req.flash('error') });
}

// validator for register
export const registerValidator = [
    check('name').notEmpty().withMessage('Name is required.'),
    check('email').notEmpty().withMessage('Email is required.'),
    check('password').notEmpty().withMessage('Password is required.').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password.');
        }
        return true;
    }),
    check('terms').equals('agree').withMessage('You must agree to the terms and conditions.'),
    check('email').custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
            throw new Error('Email already in use.');
        }
        return true;
    }),
    check('name').custom(async (value) => {
        const name = await User.findOne({ where: { name: value } });
        if (name) {
            throw new Error('Name already in use.');
        }
    })
]

// validator for login
export const loginValidator = [
    check('email').notEmpty().withMessage('Email is required.'),
    check('password').notEmpty().withMessage('Password is required.'),
]

export const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/auth/register', { errors: errors.array(), formData: req.body });
    }

    try {
        const salt = crypto.randomBytes(16).toString('base64');
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) return next(err);

            try {
                let admin;
                if (req.body.name === 'administrator'){
                    admin = 1;
                }
                const user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword.toString('base64'),
                    salt: salt,
                    role_id: admin || 2,
                });

                req.login(user, function (err) {
                    if (err) return next(err);
                    return res.redirect('/dashboard');
                })
            } catch (error) {
                next(error);
            }
        })
    } catch (error) {
        next(error);
    }
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return done(null, false, { message: 'Incorrect email or password.' });

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) return done(err);

            if (hashedPassword.toString('base64') !== user.password) return done(null, false, { message: 'Incorrect email or password.' });
            return done(null, user);
        })
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

// export const setRememberMe = (req, res, next) => {
//     // console.log(req.body.remember);
//     try {
//         if (req.body.remember === 'on') {
//             req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// }

// export const login = passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//     failureFlash: true,
// });

const resultValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/auth/login', { errors: errors.array(), formData: req.body, errorMessage: req.flash('error') });
    }
    next();
}

export const login = [
    resultValidation,
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })
]

export const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        return res.redirect('/login');
    });
}
