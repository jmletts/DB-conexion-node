"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.PaymentMethod = connection_1.default.define("PaymentMethod", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    provider: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    is_enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    processing_fee: {
        type: sequelize_1.DataTypes.DECIMAL(5, 4),
        defaultValue: 0
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});
