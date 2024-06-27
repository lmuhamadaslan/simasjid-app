import { hasAccess } from "../helpers/Helper.js";

export const index = async (req, res, next) => {
    const title = 'Dashboard';
    const user = req.user;
    const content = '../dashboard_page/index';

    res.render('backend/components/main', {
        title,
        user,
        content,
        hasAccess: await hasAccess(user)
    });
}