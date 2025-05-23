import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Invoice = sequelize.define("Invoice", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  order_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    unique: true 
  },
  invoice_number: { 
    type: DataTypes.STRING(50), 
    unique: true, 
    allowNull: false 
  },
  issue_date: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  due_date: { 
    type: DataTypes.DATE 
  },
  status: { 
    type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'), 
    defaultValue: 'pending' 
  },
  total: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  tax_amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  pdf_path: { 
    type: DataTypes.STRING(500) 
  },
  issued_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, {
  tableName: 'invoices',
  timestamps: false
});