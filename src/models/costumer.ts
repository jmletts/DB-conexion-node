import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Customer = sequelize.define("Customer", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100) 
  },
  lastName: { 
    type: DataTypes.STRING(100) 
  },
  email: { 
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  phone: { 
    type: DataTypes.STRING(20) 
  },
  is_guest: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  status: { 
    type: DataTypes.ENUM('active', 'inactive', 'suspended'), 
    defaultValue: 'active' 
  }
}, {
  tableName: 'customers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});