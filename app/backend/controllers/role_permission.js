import RolePermission from "../models/RolePermission.js";
import { decrypt, hasAccess } from "../helpers/Helper.js";
import Role from "../models/Role.js";
import Permission from "../models/Permission.js";

export const index = async (req, res, next) => {
    try {
        const title = "Management Menu";
        const user = req.user;
        const content = '../role_permission_page/index';
        const data = await RolePermission.findAll({
            include: [
                {
                    model: Role,
                    as: 'role'
                },
                {
                    model: Permission,
                    as: 'permission'
                }
            ],
        });

        const rolePermission = [];
        data.forEach(item => {
            const roleIndex = rolePermission.findIndex(roleItem => roleItem.role_id === item.role_id);
            if (roleIndex === -1) {
                rolePermission.push({
                    role_id: item.role_id,
                    role: item.role,
                    permission: [
                        {
                            permission_id: item.permission_id,
                            permission: item.permission
                        }
                    ]
                });
            } else {
                rolePermission[roleIndex].permission.push({
                    permission_id: item.permission_id,
                    permission: item.permission
                })
            }
        });

        res.render('backend/components/main', {
            title,
            user,
            content,
            data,
            hasAccess: await hasAccess(user),
            rolePermission
        });
    } catch (error) {
        next(error);
    }
}

export const create = async (req, res, next) => {
    try {
        const title = "Tambah Akses Role";
        const user = req.user;
        const content = '../role_permission_page/create';
        const roleData = await Role.findAll();
        const permissionData = await Permission.findAll();
        const existingRole = await RolePermission.findAll();
        const existingRoleIds = existingRole.map(item => item.role_id);

        res.render('backend/components/main', {
            title,
            user,
            content,
            hasAccess: await hasAccess(user),
            roleData,
            permissionData,
            existingRoleIds
        });
    } catch (error) {
        next(error);
    }
}

export const store = async (req, res, next) => {
    try {
        const { role_id, permission_id } = req.body;
        
        if (!role_id || !permission_id) {
            return res.status(400).json({
                message: "Data tidak lengkap"
            });
        }

        permission_id.forEach(async item => {
            await RolePermission.create({
                role_id,
                permission_id: item
            });
        });

        res.status(200).json({
            message: "success"
        })
    } catch (error) {
        next(error);
    }
}

export const edit = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);
        const title = "Edit Management Menu";
        const user = req.user;
        const content = '../role_permission_page/edit';
        const roles = await Role.findAll();
        const existingRole = await Role.findByPk(id);
        const permissions = await Permission.findAll();
        const rolePermission = await RolePermission.findAll({
            where: {
                role_id: id
            }
        });
        const existingPermissions = rolePermission.map(item => item.permission_id);

        res.render('backend/components/main', {
            title,
            user,
            content,
            hasAccess: await hasAccess(user),
            roles,
            existingRole: existingRole.dataValues,
            permissions,
            existingPermissions,
            encryptId: req.params.id
        })
    } catch (error) {
        next(error);
    }
}

export const update = async (req, res, next) => {
    try {
        const { role_id, permission_id } = req.body;
        const id = decrypt(req.params.id);

        if (!role_id || !permission_id) {
            return res.status(400).json({
                message: "Data tidak lengkap"
            })
        }

        await RolePermission.destroy({
            where: {
                role_id: id
            }
        });

        permission_id.forEach(async item => {
            await RolePermission.create({
                role_id: id,
                permission_id: item
            });
        });

        res.status(200).json({
            message: "success"
        });
    } catch (error) {
        next(error);
    }
}

export const destroy = async (req, res, next) => {
    try {
        const id = decrypt(req.params.id);

        await RolePermission.destroy({
            where: {
                role_id: id
            }
        });

        res.status(200).json({
            message: "success"
        })
    } catch (error) {
        next(error);   
    }
}
