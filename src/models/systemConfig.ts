import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const SystemConfig = sequelize.define("SystemConfig", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  config_key: { 
    type: DataTypes.STRING(100), 
    unique: true, 
    allowNull: false 
  },
  config_value: { 
    type: DataTypes.TEXT 
  },
  description: { 
    type: DataTypes.TEXT 
  }
}, {
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at'
});