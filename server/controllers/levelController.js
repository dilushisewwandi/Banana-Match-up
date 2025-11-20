import { Player } from "../models/PlayerModel.js";
import { Score } from "../models/ScoreModel.js";

//Save beginner level score
export const saveBeginnerScore = async(req, res) =>{

    try{
        const { playerId, scoreValue } = req.body;

        //save beginner score
        await Score.create({playerId, level: "beginner", scoreValue});

        //update player's current level to intermediate
        await Player.update({ currentLevel: "intermediate"}, {where: { playerId }});

        res.status(200).json({message: "Beginner score saved"});
    } catch (error){
        console.error("Error saving beginner score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//Save intermediate level score
export const saveIntermediateScore = async (req, res) => {
  const { playerId, scoreValue } = req.body;

  if (!playerId || scoreValue === undefined) {
    return res.status(400).json({ message: "playerId and scoreValue required" });
  }

  try {
    const newScore = await Score.create({
      playerId,
      level: "intermediate",
      scoreValue,
    });

    return res.status(201).json({
      message: "Intermediate score saved",
      scoreId: newScore.id,
    });
  } catch (err) {
    console.error("Sequelize save error:", err);
    return res.status(500).json({ message: "Database error" });
  }
};