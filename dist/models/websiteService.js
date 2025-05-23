"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteService = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.WebsiteService = connection_1.default.define("WebsiteService", {
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
    domain: {
        type: sequelize_1.DataTypes.STRING(255),
        unique: true
    },
    subdomain: {
        type: sequelize_1.DataTypes.STRING(100),
        unique: true
    },
    theme: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 'default'
    },
    custom_css: {
        type: sequelize_1.DataTypes.TEXT
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    ssl_enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'website_services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
