import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Level = sequelize.define(
    "Level", 
    {
        levelId: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        name: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        order: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        scoreThreshold: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        roundTime: { 
            type: DataTypes.INTEGER, 
            defaultValue: 0 
        } 
}, { tableName: "levels" });

export default Level;