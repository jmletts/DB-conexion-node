import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const CartItem = sequelize.define("CartItem", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  cart_id: { 
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
  },
  unit_price: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  total_price: { 
    type: DataTypes.DECIMAL(10, 2) 
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['cart_id', 'product_id']
    }
  ]
});