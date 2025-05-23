import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Cart = sequelize.define("Cart", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  customer_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: { 
    type: DataTypes.ENUM('active', 'abandoned', 'converted'), 
    defaultValue: 'active' 
  },
  total_amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  expires_at: { 
    type: DataTypes.DATE 
  }
}, {
  tableName: 'carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
