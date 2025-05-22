import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
});
