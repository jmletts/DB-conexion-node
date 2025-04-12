import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const User = sequelize.define(
    'user', 
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
        lastName: {
            type: DataTypes.STRING,
            allowNull: false // que no sera nulo
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, // que no sera nulo
            unique: true // que sea unico
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false // que no sera nulo
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false // que no sera nulo
        },
    })