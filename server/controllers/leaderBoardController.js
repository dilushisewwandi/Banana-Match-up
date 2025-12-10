import { Player, User } from "../models/index.js";

export const getLeaderboard = async (req, res) => {
  try {
    const players = await Player.findAll({
        include:[
            {
                model:User,
                attributes:["username"]
            }
        ],
        attributes: ["playerId", "totalScore"],
        order: [["totalScore", "DESC"]],
        limit: 10
    });

    const leaderboard = players.map((p) => ({
        playerId: p.playerId,
        username:p.User?.username || "Unknown",
        totalScore: p.totalScore
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
