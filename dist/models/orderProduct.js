"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProduct = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.OrderProduct = connection_1.default.define('Order_Product', {
    Orderid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    Productid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false }
});
