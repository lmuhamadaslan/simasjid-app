import { Sequelize, DataTypes } from "sequelize";
import sequeliez from "../databases/database.js";
import Role from "./Role.js";
import Permission from "./Permission.js";

const RolePermission = sequeliez.define('role_permission', {
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
    {
        timestamps: false,
        freezeTableName: true
    })

RolePermission.sync({ alter: true, force: false });
RolePermission.belongsTo(Role, { foreignKey: 'role_id', as: 'role', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id', as: 'permission', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

export default RolePermission;