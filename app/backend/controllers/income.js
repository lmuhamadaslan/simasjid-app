import { validationResult } from "express-validator";
import Income from "../models/Income.js";
import { hasAccess } from "../helpers/Helper.js";
import { decrypt } from "../helpers/Helper.js";

export const index = async (req, res, next) => {
    try {
        const title = 'Income Record';
        const user = req.user;
        const content = '../income_page/index';
        const income = await Income.findAll({
            include: ['user']
        });

        res.render('backend/components/main', {
            title,
            user,
            income,
            content,
            hasAccess: await hasAccess(user)
        });
    } catch (error) {
        next(error);
    }
}

export const create =  async (req, res, next) => {
    try {
        const title = 'Income Record';
        const user = req.user;
        const content = '../income_page/create';

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
            title: 'Income Record',
            user: req.user,
            content: '../income_page/create',
            hasAccess: await hasAccess(user),
            errors: errors.array(),
            fromData: req.body
        });
    }

    try {
        const { date, source, amount, description } = req.body;

        await Income.create({
            date,
            source,
            amount,
            description,
            user_id: req.user.id
        });

        res.redirect('/income-record');
    } catch (error) {
        next(error);
    }
}

export const edit = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const title = 'Income Record';
        const user = req.user;
        const content = '../income_page/edit';
        const income = await Income.findByPk(id);

        const formattedDate =  income.dataValues.date.toISOString().split('T')[0].split('-').join('-');
        console.log(formattedDate);

        res.render('backend/components/main', {
            title,
            user,
            income,
            content,
            formattedDate,
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
            title: 'Income Record',
            user: req.user,
            content: '../income-record/edit',
            hasAccess: await hasAccess(user),
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        const {date, source, amount, description} = req.body;
        const id = decrypt(req.params.id);
        const income = await Income.findByPk(id);
        income.date = date;
        income.source = source;
        income.amount = amount;
        income.description = description;
        income.user_id = req.user.id;
        await income.save();

        res.redirect('/income-record');
    } catch (error) {
        next(error);
    }
}

export const destroy = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const income = await Income.findByPk(id);
        await income.destroy();

        res.status(200).json({
            message: 'Permission has been removed!'
        })
    } catch (error) {
        console.error("Error: ", error);
        next(error);
    }
}