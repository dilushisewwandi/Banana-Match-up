import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
// import { User } from "./UserModel.js";

export const Player = sequelize.define(
    "Player",
    {
        playerId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        totalScore:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        bananaCount:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        currentLevel:{
            type: DataTypes.STRING,
            defaultValue: "beginner",
        },
    },
    {
        tableName: "players"
    }
);

export default Player;





