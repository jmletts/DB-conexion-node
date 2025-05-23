"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.CartItem = connection_1.default.define("CartItem", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cart_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    unit_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2)
    },
    total_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2)
    }
}, {
    tableName: 'cart_items',
    timestamps: true,
    createdAt: 'added_at',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['cart_id', 'product_id']
        }
    ]
});
