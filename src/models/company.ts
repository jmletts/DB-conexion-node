import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Company = sequelize.define("Company", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    unique: true,
    allowNull: false
  },
  name: { 
    type: DataTypes.STRING(100) 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  address: { 
    type: DataTypes.STRING(500) 
  },
  phone: { 
    type: DataTypes.STRING(20) 
  },
  email: { 
    type: DataTypes.STRING(150),
    validate: {
      isEmail: true
    }
  },
  website: { 
    type: DataTypes.STRING(200) 
  },
  tax_id: { 
    type: DataTypes.STRING(50) 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'companies',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});