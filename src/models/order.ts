import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Order = sequelize.define("Order", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  cart_id: { 
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
  service_origin: { 
    type: DataTypes.ENUM('OnePay', 'Website')
  },
  shipping_address: { 
    type: DataTypes.TEXT 
  },
  billing_address: { 
    type: DataTypes.TEXT 
  },
  payment_method: { 
    type: DataTypes.STRING(50) 
  },
  payment_status: { 
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'), 
    defaultValue: 'pending' 
  },
  notes: { 
    type: DataTypes.TEXT 
  },
  order_date: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});