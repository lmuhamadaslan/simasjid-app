import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../databases/database.js";

const Permission = sequelize.define('permission', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Permission.sync({ alter: true, force: false });

export default Permission;