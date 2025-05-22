import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export const ProductCategory = sequelize.define('Product_Category', {
    Productid: { type: DataTypes.INTEGER, primaryKey: true },
    Categoryid: { type: DataTypes.INTEGER, primaryKey: true }
});
