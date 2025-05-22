"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Address = connection_1.default.define("Address", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('shipping', 'billing'),
        defaultValue: 'shipping'
    },
    street: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    city: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    state: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    postal_code: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    country: {
        type: sequelize_1.DataTypes.STRING(100),
        defaultValue: 'Mexico'
    },
    is_default: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});
