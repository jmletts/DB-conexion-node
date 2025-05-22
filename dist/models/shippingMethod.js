"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingMethod = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.ShippingMethod = connection_1.default.define("ShippingMethod", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT
    },
    base_cost: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false
    },
    cost_per_kg: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        defaultValue: 0
    },
    estimated_days: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    is_available: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});
