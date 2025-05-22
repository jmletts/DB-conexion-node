import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const ProductImage = sequelize.define("ProductImage", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  product_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  image_url: { 
    type: DataTypes.STRING(500), 
    allowNull: false 
  },
  alt_text: { 
    type: DataTypes.STRING(200) 
  },
  is_primary: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  display_order: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, {
  timestamps: false
});