"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Product = connection_1.default.define("Product", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    cost_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2)
    },
    sku: {
        type: sequelize_1.DataTypes.STRING(100),
        unique: true
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    min_stock: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 5
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    brand: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    weight: {
        type: sequelize_1.DataTypes.DECIMAL(8, 3)
    },
    dimensions: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
