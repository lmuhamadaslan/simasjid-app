import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import Role from "./Role.js";

const User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
    freezeTableName: true,
});

User.sync({ alter: true, force: false });
User. belongsTo(Role, { foreignKey: 'role_id', as: 'role'});
export default User;