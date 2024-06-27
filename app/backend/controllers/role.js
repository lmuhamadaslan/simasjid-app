import Role from '../models/Role.js';
import { decrypt } from '../helpers/Helper.js';
import { validationResult } from 'express-validator';
import { hasAccess } from '../helpers/Helper.js';

export const index = async (req, res, next) => {
    try {
        const title = 'Role';
        const user = req.user;
        const roles = await Role.findAll();
        const content = '../role_page/index';

        res.render('backend/components/main', {
            title,
            user,
            content,
            roles,
            hasAccess: await hasAccess(user),
        });
    } catch (error) {
        next(error);
    }
}

export const create = async (req, res, next) => {
    try {
        const title = 'Role'
        const user = req.user;
        const content = '../role_page/create';

        res.render('backend/components/main', {
            title,
            user,
            content,
            hasAccess: await hasAccess(user),
        });
    } catch (error) {
        next(error);
    }
}

export const store = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/components/main', {
            title: 'Role',
            user: req.user,
            content: '../role_page/create',
            hasAccess: await hasAccess(user),
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        const { name, description } = req.body;
        await Role.create({
            name,
            description
        });

        res.redirect('/role');
    } catch (error) {
        next(error);
    }
}

export const edit = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const title = 'Role';
        const user = req.user;
        const role = await Role.findByPk(id);
        const content = '../role_page/edit';

        res.render('backend/components/main', {
            title,
            user,
            content,
            role,
            hasAccess: await hasAccess(user),
        });
    } catch (error) {
        next(error);
    }
}

export const update = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/components/main', {
            title: 'Role',
            user: req.user,
            content: '../role_page/edit',
            hasAccess: await hasAccess(user),
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        const { name, description } = req.body;
        const id = decrypt(req.params.id);
        const role = await Role.findByPk(id);
        role.name = name;
        role.description = description;
        await role.save();

        res.redirect('/role');
    } catch (error) {
        next(error);
    }
}

export const destroy = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const role = await Role.findByPk(id);
        await role.destroy();

        res.status(200).json({ message: 'Role has been deleted' });
    } catch (error) {
        console.error("Error: ", error);
        next(error);
    }
}