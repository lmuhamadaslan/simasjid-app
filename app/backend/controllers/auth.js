import express from 'express';
import User from '../models/User.js';
import crypto from 'crypto';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { validationResult } from 'express-validator';
import CryptoJS from 'crypto-js';
import { resultValidation } from '../validation/LoginValidator.js';

export const registerPage = (req, res, next) => {
    const title = 'Register';

    res.render('backend/auth/register', { title, formData: {} });
}

export const loginPage = (req, res, next) => {
    const title = 'Login';
    const secret = process.env.SECRET_KEY;

    res.render('backend/auth/login', { title, formData: {}, errorMessage: req.flash('error'), secret });
}

export const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/auth/register', { errors: errors.array(), formData: req.body, title: 'Register' });
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
        // decrypt password and email using CryptoJS
        const emailDecrypted = CryptoJS.AES.decrypt(email, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const passDecrypted = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

        const user = await User.findOne({ where: { email: emailDecrypted } });

        if (!user) return done(null, false, { message: 'Incorrect email or password.' });

        crypto.pbkdf2(passDecrypted, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
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
