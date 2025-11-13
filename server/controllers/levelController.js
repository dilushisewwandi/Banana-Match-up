import { Player } from "../models/PlayerModel";
import { Score } from "../models/ScoreModel";

export const savebeginnerScore = async(req, res) =>{
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

