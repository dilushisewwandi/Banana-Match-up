import axios from "axios";
import Score from "../models/ScoreModel.js";

//get bonus challenge from Banana API
export const getBonusChallenge = async (req, res) => {
  try {
    const response = await axios.get("https://marcconrad.com/uob/banana/api.php");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bonus challenge" });
  }
};

//save bonus scores
export const submitBonusScore = async (req, res) => {
  try {
    const { playerId, level, bonusPoints } = req.body;

    if (!playerId || !level) {
      return res.status(400).json({ message: "playerId and level are required" });
    }

    // check if existing score record exists
    let score = await Score.findOne({where: { playerId, level }});

    // If no score record → create one
    if (!score) {
      score = await Score.create({
        playerId,
        level,
        scoreValue: 0,
        bonusScore: bonusPoints || 0,
      });
      return res.status(201).json({ message: "Bonus saved", score });
    }

    // Update existing record
    score.bonusScore += bonusPoints;
    await score.save();

    return res.status(200).json({
      message: "Bonus score updated successfully",
      updatedScore: score,
    });

  } catch (error) {
    return res.status(500).json({ message: "Error saving bonus score" });
  }
};
