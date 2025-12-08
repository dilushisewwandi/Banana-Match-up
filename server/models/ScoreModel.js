import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Player } from "./PlayerModel.js";
import { Level } from "./LevelModel.js";

export const Score = sequelize.define("Score", {
  scoreId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  playerId: { type: DataTypes.INTEGER, references: { model: "players", key: "playerId" } },
  levelId: { type: DataTypes.INTEGER, references: { model: "levels", key: "levelId" } },
  roundsScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  bonusScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  scoreValue: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: "scores" });

Player.hasMany(Score, { foreignKey: "playerId" });
Score.belongsTo(Player, { foreignKey: "playerId" });
Level.hasMany(Score, { foreignKey: "levelId" });
Score.belongsTo(Level, { foreignKey: "levelId" });

export default Score;