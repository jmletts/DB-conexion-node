"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Order = connection_1.default.define("Order", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    order_number: {
        type: sequelize_1.DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    total_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    tax_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    shipping_cost: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        defaultValue: 0
    },
    discount_amount: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        defaultValue: 0
    },
    payment_method_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    shipping_method_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    shipping_address_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    billing_address_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT
    },
    order_date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
