import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Player } from "./PlayerModel.js";

export const Score = sequelize.define(
    "Score",
    {
        scoreId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        scoreValue:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        tableName: "scores",
        timestamps: true,
    }
);

//Associations
Player.hasMany(Score, {foreignKey: "playerId", onDelete: "CASCADE"});
Score.belongsTo(Player, {foreignKey: "playerId"});