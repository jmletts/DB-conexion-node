import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Address = sequelize.define("Address", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.ENUM('shipping', 'billing'), 
    defaultValue: 'shipping' 
  },
  street: { 
    type: DataTypes.STRING(200), 
    allowNull: false 
  },
  city: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  state: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  postal_code: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
  country: { 
    type: DataTypes.STRING(100), 
    defaultValue: 'Mexico' 
  },
  is_default: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});