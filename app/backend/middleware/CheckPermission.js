import Permission from "../models/Permission.js";
import Role from "../models/Role.js";
import RolePermission from "../models/RolePermission.js";
import User from "../models/User.js";

async function checkPermission(userId, permission) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const role = await Role.findByPk(user.role_id);
        if (!role) {
            throw new Error('Role not found');
        }

        const rolePermission = await RolePermission.findAll({
            where: {
                role_id: role.id
            },
            include: [
                {
                    model: Permission,
                    as: 'permission',
                    where: {
                        name: permission
                    }
                }
            ]
        });

        for (let i = 0; i < rolePermission.length; i++) {
            if (rolePermission[i].permission.name === permission) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default checkPermission;