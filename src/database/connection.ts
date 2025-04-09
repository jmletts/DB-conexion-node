import { Sequelize } from "sequelize";

const sequelize = new Sequelize('api-node', 'root', '11111111' ,{
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        options: {
            allowPublicKeyRetrieval: true 
        }
    }
});

export default sequelize;