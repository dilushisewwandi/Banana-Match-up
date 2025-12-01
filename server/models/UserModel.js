import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// Define the User model
export const User = sequelize.define(
  "User", 
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users", 
    timestamps: true, 
  }
);

export default User;