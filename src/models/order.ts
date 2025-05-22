import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Order = sequelize.define("Order", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  order_number: { 
    type: DataTypes.STRING(50), 
    unique: true, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'), 
    defaultValue: 'pending' 
  },
  total_amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  tax_amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  shipping_cost: { 
    type: DataTypes.DECIMAL(8, 2), 
    defaultValue: 0 
  },
  discount_amount: { 
    type: DataTypes.DECIMAL(8, 2), 
    defaultValue: 0 
  },
  payment_method_id: { 
    type: DataTypes.INTEGER 
  },
  shipping_method_id: { 
    type: DataTypes.INTEGER 
  },
  shipping_address_id: { 
    type: DataTypes.INTEGER 
  },
  billing_address_id: { 
    type: DataTypes.INTEGER 
  },
  notes: { 
    type: DataTypes.TEXT 
  },
  order_date: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});