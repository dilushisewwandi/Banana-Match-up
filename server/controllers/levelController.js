import { Player } from "../models/PlayerModel.js";
import { Score } from "../models/ScoreModel.js";

//Save beginner level score
export const saveBeginnerScore = async(req, res) =>{

    try{
        const { playerId, scoreValue } = req.body;

        //save beginner score
        await Score.create({playerId, level: "beginner", scoreValue});

        //update player's current level to intermediate
        await Player.update({ currentLevel: "intermediate"}, {where: { id: playerId}});

        res.status(200).json({message: "Beginner score saved, level updated!"});
    } catch (error){
        console.error("Error saving beginner score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//Save intermediate level score
export const saveIntermediateScore = async (req, res) => {
  try {
    const { playerId, scoreValue } = req.body;

    // Save intermediate score
    await Score.create({ playerId, level: "intermediate", scoreValue });

    // Update player's current level to advanced)
    await Player.update({ currentLevel: "advanced" }, { where: { id: playerId } });

    res.status(200).json({ message: "Intermediate score saved, level updated!" });
  } catch (error) {
    console.error("Error saving intermediate score:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};