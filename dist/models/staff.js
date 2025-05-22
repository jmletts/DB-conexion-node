"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Staff = connection_1.default.define("Staff", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'manager', 'employee'),
        defaultValue: 'employee'
    },
    department: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    salary: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2)
    },
    hire_date: {
        type: sequelize_1.DataTypes.DATEONLY
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});
