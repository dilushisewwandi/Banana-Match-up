import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const BananaGame = sequelize.define(
  "BananaGame", 
  {
    gameId: {
      type: DataTypes.STRING, 
      primaryKey: true 
    },
    playerId: {
      type: DataTypes.INTEGER 
    },
    solution: { 
      type: DataTypes.INTEGER 
    },
    used: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    expiredAt: { 
      type: DataTypes.DATE 
    }
}, { tableName: "banana_games" });

export default BananaGame;