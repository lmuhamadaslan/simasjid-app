import User from '../models/User.js';
import { decrypt, hasAccess } from '../helpers/Helper.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import Role from '../models/Role.js';
import { name } from 'ejs';
import { log } from 'console';

export const index = async (req, res, next) => {
    try {
        const title = 'User';
        const user = req.user;
        const users = await User.findAll({
            include: ['role']
        });
        const content = '../user_page/index';

        const filterUser = users.filter(user => user.role_id !== 1);
        res.render('backend/components/main', {
            title,
            user,
            users,
            content,
            hasAccess: await hasAccess(user),
            filterUser
        })
    } catch (error) {
        next(error);
    }
}

export const create = async (req, res, next) => {
    try {
        const title = 'Add User';
        const user = req.user;
        const content = '../user_page/create';
        const role = await Role.findAll();
        const filterRole = role.filter(role => role.id !== 1);

        res.render('backend/components/main', {
            title,
            user,
            content,
            hasAccess: await hasAccess(user),
            filterRole
        })
    } catch (error) {
        next(error);
    }
}

export const store = async (req, res, next) => {
    const errors = validationResult(req);
    const role = await Role.findAll();
    const filterRole = role.filter(role => role.id !== 1);
    
    if (!errors.isEmpty()) {
        return res.render('backend/components/main', { 
            title: 'Add User',
            user: req.user,
            content: '../user_page/create',
            hasAccess: await hasAccess(req.user),
            errors: errors.array(),
            fromData: req.body,
            filterRole
         });
    }

    try {
        const salt = crypto.randomBytes(16).toString('base64');
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
            if (err) return next(err);

            try {
                await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword.toString('base64'),
                    salt: salt,
                    role_id: req.body.role_id
                });

                res.redirect('/user');
            } catch (error) {
                next(error);
            }
        })
    } catch (error) {
        next(error);
    }
}

export const destroy = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const users = await User.findByPk(id);
        await users.destroy();

        res.json({ message: 'User has been deleted' });
    } catch (error) {
        next(error);
    }
}