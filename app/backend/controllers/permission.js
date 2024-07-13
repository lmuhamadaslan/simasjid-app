import Permission from '../models/Permission.js';
import { decrypt, hasAccess } from '../helpers/Helper.js';
import { validationResult } from 'express-validator';

export const index = async (req, res, next) => {
    try {
        const title = 'Permission';
        const user = req.user;
        const permission = await Permission.findAll();
        const content = '../permission_page/index'

        res.render('backend/components/main', {
            title,
            user,
            permission,
            content,
            hasAccess: await hasAccess(user)
        });
    } catch (error) {
        next(error);
    }
}

export const create = async (req, res, next) => {
    try {
        const title = 'Permission';
        const user = req.user;
        const content = '../permission_page/create'

        res.render('backend/components/main', {
            title,
            user,
            content,
            hasAccess: await hasAccess(user)
        });
    } catch (error) {
        next(error);
    }
}

export const store = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/components/main', {
            title: 'Permission',
            user: req.user,
            content: '../permission_page/create',
            hasAccess: await hasAccess(user),
            errors: errors.array(),
            fromData: req.body
        });
    }

    try {
        const { name, description } = req.body;
        await Permission.create({
            name,
            description
        });

        res.redirect('/permission');
    } catch (error) {
        next(error);
    }
}

export const edit = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const title = "Permission";
        const user = req.user;
        const permission = await Permission.findByPk(id);
        const content = '../permission_page/edit';

        res.render('backend/components/main', {
            title,
            user,
            content,
            permission,
            hasAccess: await hasAccess(user)
        });
    } catch (error) {
        next(error);
    }
}

export const update =  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('backend/compoenents/main', {
            title: 'Permission',
            user: req.user,
            content: '../permission_page/edit',
            hasAccess: await hasAccess(user),
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        const {name, description} = req.body;
        const id = decrypt(req.params.id);
        const permission = await Permission.findByPk(id);
        permission.name = name;
        permission.description = description;
        await permission.save();

        res.redirect('/permission');
    } catch (error) {
        next(error);
    }
}

export const destroy = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const permission = await Permission.findByPk(id);
        await permission.destroy();

        res.status(200).json({
            message: 'Permission has been removed!'
        })
    } catch (error) {
        console.error("Error: ", error);
        next(error);
    }
}