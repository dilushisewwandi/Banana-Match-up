import { Player } from "../models/PlayerModel.js";
import { Score } from "../models/ScoreModel.js";

export const saveBeginnerScore = async(req, res) =>{
    try{
        const { playerId, scoreValue } = req.body;

        //save score
        await Score.create({playerId, level: "beginner", scoreValue});

        //update player's current level to intermediate
        await Player.update({ currentLevel: "intermediate"}, {where: { id: playerId}});

        res.status(200).json({message: "Beginner score saved, level updated!"});
    } catch (error){
        console.error("Error saving beginner score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

