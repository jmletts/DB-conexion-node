"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.Invoice = connection_1.default.define("Invoice", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    invoice_number: {
        type: sequelize_1.DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    issue_date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    due_date: {
        type: sequelize_1.DataTypes.DATE
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'),
        defaultValue: 'pending'
    },
    total_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    pdf_path: {
        type: sequelize_1.DataTypes.STRING(500)
    }
}, {
    timestamps: false
});
