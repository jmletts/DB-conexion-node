"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Review = connection_1.default.define('Review', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: sequelize_1.DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    comment: { type: sequelize_1.DataTypes.TEXT },
    Userid: { type: sequelize_1.DataTypes.INTEGER },
    Productid: { type: sequelize_1.DataTypes.INTEGER },
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW }
});
