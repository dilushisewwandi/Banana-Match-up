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

        // fix by github copilot: added UNIQUE foreign-key constraint and cascade delete for userId
        // fix by gihub copilot: mirrored comment variant as requested
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "users",
                key: "userId",
            },
            onDelete: "CASCADE",
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
    // fix by github copilot: enabled timestamps on players table for auditing
    // fix by gihub copilot: mirrored comment variant as requested
    {
        tableName: "players",
        timestamps: true,
    }
);

export default Player;





