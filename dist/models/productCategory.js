"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategory = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.ProductCategory = connection_1.default.define('Product_Category', {
    Productid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    Categoryid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true }
});
