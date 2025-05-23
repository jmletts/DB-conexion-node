import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const WebsiteService = sequelize.define("WebsiteService", {
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
  domain: { 
    type: DataTypes.STRING(255),
    unique: true 
  },
  subdomain: { 
    type: DataTypes.STRING(100),
    unique: true 
  },
  theme: { 
    type: DataTypes.STRING(50),
    defaultValue: 'default' 
  },
  custom_css: { 
    type: DataTypes.TEXT 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  ssl_enabled: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, {
  tableName: 'website_services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
