import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export const Company = sequelize.define('Company', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    logourl: { type: DataTypes.STRING },
    industry: { type: DataTypes.STRING },
    Userid: { type: DataTypes.INTEGER, allowNull: false }
});
