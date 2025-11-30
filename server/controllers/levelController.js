import { Player } from "../models/PlayerModel.js";
import { Score } from "../models/ScoreModel.js";
import { sequelize } from "../config/db.js";

//Save beginner level score
export const saveBeginnerScore = async(req, res) =>{

    try{
        const { playerId, scoreValue } = req.body;

        //input validation
        playerId = parseInt(playerId, 10);
        scoreValue = Number(scoreValue);

        if(!playerId || isNaN(scoreValue)){
          return res.status(400).json({message: "Invalid playerId or scoreValue"});
        }

        //check if player exists
        const player = await Player.findByPk(playerId);
        if(!playerId){
          return res.status(404).json({message:"Player not fount"});
        }

        //ensure both score and player successfully updated
        await sequelize.transaction(async (t) => {
          //save score
          await Score.create({playerId, level:"beginner", scoreValue}, {transaction:t});

          //update current level and total score
          await Player.update({ currentLevel:"intermediate", totalScore: player.totalScore + scoreValue,},
            {where:{playerId}, transaction: t}
          );
        });

        return res.status(200).json({message:"Beginner score saved successfully"});
      } catch (error){
        console.error("Error saving beginner score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

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