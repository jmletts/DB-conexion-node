import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const ShippingMethod = sequelize.define("ShippingMethod", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  base_cost: { 
    type: DataTypes.DECIMAL(8, 2), 
    allowNull: false 
  },
  cost_per_kg: { 
    type: DataTypes.DECIMAL(8, 2), 
    defaultValue: 0 
  },
  estimated_days: { 
    type: DataTypes.STRING(20) 
  },
  is_available: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});