import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING },
  passwordHash: { type: DataTypes.STRING },
  Status: { type: DataTypes.INTEGER },
  createAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
