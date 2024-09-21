import { DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import User from "./User.js";

const Income = sequelize.define('income', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    freezeTableName: true
});

Income.sync({ alter: true, force: false });
Income.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
export default Income;
