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
        bonusScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        playerId:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"players",
                key:"playerId",
            },
            onDelete:"CASCADE",
        },
    },
    {
        tableName: "scores",
        timestamps: true,
    }
);

export default Score;