"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('api-node', 'root', '11111111', {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        allowPublicKeyRetrieval: true
    }
});
exports.default = sequelize;
