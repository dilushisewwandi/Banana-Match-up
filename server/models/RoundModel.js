import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Level  from "./LevelModel.js";

export const Round = sequelize.define(
  "Round", {
    roundId: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    levelId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: "levels", key: "levelId" } 
    },
    clue: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    options: { 
      type: DataTypes.JSON, 
      allowNull: false 
    }, 
    answer: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    roundTime: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    } 
}, { tableName: "rounds" });

Level.hasMany(Round, { foreignKey: "levelId" });
Round.belongsTo(Level, { foreignKey: "levelId" });

export default Round;
