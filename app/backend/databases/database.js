import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequeliez =new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host:  process.env.DB_HOST === "127.0.0.1" ? "host.docker.internal" : process.env.DB_HOST, 
    dialect: "mysql",
    logging: false,
    dialectOptions: {
        connectTimeout: 60000
    }
});
 
export default sequeliez;