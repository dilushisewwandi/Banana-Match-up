import { Player } from "../models/PlayerModel.js";
import { User } from "../models/UserModel.js";

export const getPlayerResult = async (req, res) => {
  try {
    const { playerId } = req.params;

    const player = await Player.findOne({
      where: { playerId },
      include: [
        {
          model: User,
          attributes: ["username"]
        }
      ]
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({
      playerName: player.User?.username || "Player",
      score: player.totalScore || 0
    });
  } catch (error) {
    console.error("getPlayerResult error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
