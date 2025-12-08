import { Player, Score, Level, Round, sequelize } from "../models/index.js";

const SCORE_THRESHOLD = 90;

// Save Beginner Level Score
export const saveBeginnerScore = async (req, res) => {
  try {
    let { playerId, scoreValue } = req.body;

    // input validation
    playerId = parseInt(playerId, 10);
    scoreValue = Number(scoreValue);
    if (!playerId || isNaN(scoreValue)) {
      return res.status(400).json({ message: "Invalid playerId or scoreValue" });
    }

    // check if player exists
    const player = await Player.findByPk(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    // get beginner level from DB
    const level = await Level.findOne({ where: { name: "beginner" } });
    if (!level) return res.status(404).json({ message: "Beginner level not found" });

    await sequelize.transaction(async (t) => {
      // save score
      await Score.create(
        { playerId, levelId: level.levelId, levelName: "beginner", scoreValue },
        { transaction: t }
      );

      // update player's totalScore and currentLevel
      await player.update(
        {
          totalScore: player.totalScore + scoreValue,
          currentLevel: "intermediate"
        },
        { transaction: t }
      );
    });

    return res.status(200).json({ message: "Beginner score saved successfully" });
  } catch (error) {
    console.error("Error saving beginner score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Save Intermediate Level Score
export const saveIntermediateScore = async (req, res) => {
  try {
    const { playerId, roundsScore = 0, bonusScore = 0 } = req.body;
    if (!playerId) return res.status(400).json({ message: "playerId required" });

    const rounds = Number(roundsScore);
    const bonusBananas = Number(bonusScore);
    const bonusPoints = Math.floor((bonusBananas / 5) * 10); // 5 bananas = 10 points
    const intermediateTotal = rounds + bonusPoints;

    const player = await Player.findByPk(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const level = await Level.findOne({ where: { name: "intermediate" } });
    if (!level) return res.status(404).json({ message: "Intermediate level not found" });

    await sequelize.transaction(async (t) => {
      // find existing score record for intermediate
      let scoreRecord = await Score.findOne({
        where: { playerId, levelId: level.levelId },
        transaction: t,
      });

      if (scoreRecord) {
        // subtract old score from totalScore
        const oldPoints = scoreRecord.scoreValue;
        await scoreRecord.update(
          { roundsScore: rounds, bonusScore: bonusPoints, scoreValue: intermediateTotal },
          { transaction: t }
        );

        // update player
        const correctedTotal = player.totalScore - oldPoints + intermediateTotal;
        await player.update(
          {
            totalScore: correctedTotal,
            bananaCount: player.bananaCount + bonusBananas,
            currentLevel: correctedTotal >= SCORE_THRESHOLD ? "advanced" : player.currentLevel,
          },
          { transaction: t }
        );
      } else {
        // new score record
        await Score.create(
          {
            playerId,
            levelId: level.levelId,
            levelName: "intermediate",
            roundsScore: rounds,
            bonusScore: bonusPoints,
            scoreValue: intermediateTotal,
          },
          { transaction: t }
        );

        // update player
        const correctedTotal = player.totalScore + intermediateTotal;
        await player.update(
          {
            totalScore: correctedTotal,
            bananaCount: player.bananaCount + bonusBananas,
            currentLevel: correctedTotal >= SCORE_THRESHOLD ? "advanced" : player.currentLevel,
          },
          { transaction: t }
        );
      }

      res.status(200).json({ message: "Intermediate score saved", intermediateTotal });
    });
  } catch (err) {
    console.error("Intermediate save error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRoundsByLevel = async (req, res) => {
  const { levelId } = req.params;

  try {
    //fetch level
    const level = await Level.findByPk(levelId,{
      attributes:["levelId", "name", "scoreThreshold"]
    });
    
    if (!level){
      return res.status(404).json({message: "Level not found"});
    }

    //fetch rounds
    const rounds = await Round.findAll({
      where: { levelId },
      attributes: ["roundId", "clue", "options", "answer", "roundTime"],
      order: [["roundId","ASC"]]
    });

    const parsedRounds = rounds.map(r => {
      let opts  = r.options;
      if(typeof opts === "string"){
        try{
          opts = JSON.parse(opts);
        }catch{
          opts = [];
        }
      }
      return {...r.dataValues, options: opts || []};
    });

    res.json({ level, rounds: parsedRounds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
