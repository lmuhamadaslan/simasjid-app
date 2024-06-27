import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import Permission from "./Permission.js";

const Role = sequelize.define('role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},
{
    timestamps: false,
    freezeTableName: true
});

Role.sync({ alter: true, force: false });
Role.belongsToMany(Permission, { through: 'role_permission', as: 'permissions', foreignKey: 'role_id'});
Permission.belongsToMany(Role, { through: 'role_permission', as: 'roles', foreignKey: 'permission_id'});

export default Role;