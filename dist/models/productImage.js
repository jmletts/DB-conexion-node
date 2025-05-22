"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
exports.ProductImage = connection_1.default.define("ProductImage", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false
    },
    alt_text: {
        type: sequelize_1.DataTypes.STRING(200)
    },
    is_primary: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_order: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: false
});
