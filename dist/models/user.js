"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.User = connection_1.default.define('user', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false // que no sera nulo
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false // que no sera nulo
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false, // que no sera nulo
        unique: true // que sea unico
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false // que no sera nulo
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false // que no sera nulo
    },
});
