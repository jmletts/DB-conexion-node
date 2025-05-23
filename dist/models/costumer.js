"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Customer = connection_1.default.define("Customer", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    is_guest: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active'
    }
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
