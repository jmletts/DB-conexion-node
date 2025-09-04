import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  lastName: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(150), 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  phone: { 
    type: DataTypes.STRING(20) 
  },
  status: { 
    type: DataTypes.ENUM('active', 'inactive', 'suspended', 'first_access'), 
    defaultValue: 'active' 
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});