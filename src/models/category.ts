import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Category = sequelize.define("Category", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: true 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  parent_id: { 
    type: DataTypes.INTEGER,
    allowNull: true 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});