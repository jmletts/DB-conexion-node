import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Product = sequelize.define(
    'products', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false // que no sera nulo
        },
        description: {
            type: DataTypes.STRING// que no sera nulo
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false // que no sera nulo
        },
    })