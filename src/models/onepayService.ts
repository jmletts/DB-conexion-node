import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const OnepayService = sequelize.define("OnepayService", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  company_id: { 
    type: DataTypes.INTEGER, 
    unique: true,
    allowNull: false
  },
  enabled: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  api_key: { 
    type: DataTypes.STRING(255) 
  },
  webhook_url: { 
    type: DataTypes.STRING(500) 
  },
  commission_rate: { 
    type: DataTypes.DECIMAL(5, 4), 
    defaultValue: 0 
  }
}, {
  tableName: 'onepay_services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});