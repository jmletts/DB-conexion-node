import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Product = sequelize.define("Product", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  company_id: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: { 
    type: DataTypes.STRING(200), 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  cost_price: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  sku: { 
    type: DataTypes.STRING(100), 
    unique: true 
  },
  stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  min_stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 5 
  },
  brand: { 
    type: DataTypes.STRING(100) 
  },
  weight: { 
    type: DataTypes.DECIMAL(8, 3) 
  },
  dimensions: { 
    type: DataTypes.STRING(50) 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});