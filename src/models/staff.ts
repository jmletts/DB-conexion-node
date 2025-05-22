import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Staff = sequelize.define("Staff", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(150), 
    unique: true, 
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  role: { 
    type: DataTypes.ENUM('admin', 'manager', 'employee'), 
    defaultValue: 'employee' 
  },
  department: { 
    type: DataTypes.STRING(100) 
  },
  salary: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  hire_date: { 
    type: DataTypes.DATEONLY 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});