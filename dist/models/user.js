"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.User = connection_1.default.define("User", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended', 'first_access'),
        defaultValue: 'active'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
