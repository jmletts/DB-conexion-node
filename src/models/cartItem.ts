import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const CartItem = sequelize.define("CartItem", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  product_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 1 
  }
}, {
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id']
    }
  ]
});