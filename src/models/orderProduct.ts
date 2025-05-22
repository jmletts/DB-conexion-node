import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';

export const OrderProduct = sequelize.define('Order_Product', {
    Orderid: { type: DataTypes.INTEGER, primaryKey: true },
    Productid: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
});
