import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../databases/database.js";

const User = sequelize.define('User', {
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
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
    }
}, {
    timestamps: true,
    freezeTableName: true,
});

User.sync({ alter: true, force: false });

export default User;