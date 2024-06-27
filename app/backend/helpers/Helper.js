import Permission from "../models/Permission.js";
import RolePermission from "../models/RolePermission.js";

export const hasAccess = async (user) => {
    try {
        const permissionName = await RolePermission.findAll({
            where: {
                role_id: user.role_id
            },
            include: {
                model: Permission,
                as: 'permission'
            }
        });

        const hasAccess = permissionName.map(item => item.permission.name);
        return hasAccess;
    } catch (error) {
        throw error;
    }
}

export const encrypt = (url) => {
    return Buffer.from(url).toString('base64');
}

export const decrypt = (url) => {
    return Buffer.from(url, 'base64').toString('ascii');
}

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}