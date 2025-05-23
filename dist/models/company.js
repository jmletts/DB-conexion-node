"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Company = connection_1.default.define("Company", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    description: {
        type: sequelize_1.DataTypes.TEXT
    },
    address: {
        type: sequelize_1.DataTypes.STRING(500)
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        validate: {
            isEmail: true
        }
    },
    website: {
        type: sequelize_1.DataTypes.STRING(200)
    },
    tax_id: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'companies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
