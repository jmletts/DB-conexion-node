"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnepayService = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.OnepayService = connection_1.default.define("OnepayService", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    api_key: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    webhook_url: {
        type: sequelize_1.DataTypes.STRING(500)
    },
    commission_rate: {
        type: sequelize_1.DataTypes.DECIMAL(5, 4),
        defaultValue: 0
    }
}, {
    tableName: 'onepay_services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
