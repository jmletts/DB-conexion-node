import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const PaymentMethod = sequelize.define("PaymentMethod", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true 
  },
  provider: { 
    type: DataTypes.STRING(50) 
  },
  is_enabled: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  processing_fee: { 
    type: DataTypes.DECIMAL(5, 4), 
    defaultValue: 0 
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});