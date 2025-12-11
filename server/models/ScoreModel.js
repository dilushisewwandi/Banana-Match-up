import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Player } from "./PlayerModel.js";
import { Level } from "./LevelModel.js";

// fix by github copilot: made playerId/levelId non-nullable and added `playedAt` + timestamps to keep play history

export const Score = sequelize.define(
  "Score",
  {
    scoreId: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true },
    playerId: { 
      type: DataTypes.INTEGER, 
      references: { model: "players", key: "playerId" }, 
      allowNull: false },
    levelId: { 
      type: DataTypes.INTEGER, 
      references: { model: "levels", key: "levelId" }, 
      allowNull: false },
    roundsScore: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 },
    bonusScore: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 },
    scoreValue: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 },
    playedAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW },
  },
  { tableName: "scores", timestamps: true }
);

Player.hasMany(Score, { foreignKey: "playerId" });
Score.belongsTo(Player, { foreignKey: "playerId" });
Level.hasMany(Score, { foreignKey: "levelId" });
Score.belongsTo(Level, { foreignKey: "levelId" });

export default Score;