import { Player, Score, Level, Round, sequelize } from "../models/index.js";

//get rounds by level
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

    //parse options
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


// save beginner level score
export const saveBeginnerScore = async (req, res) => {
  try {

    // allow deriving playerId from JWT user id when route protected(fix by github copilot)
    const userIdFromToken = req.user?.id;
    const playerRecord = await Player.findOne({where: {userId: userIdFromToken}});
    let playerId = playerRecord.playerId;

    if (!playerId && userIdFromToken) {
      const p = await Player.findOne({ where: { userId: userIdFromToken } });
      playerId = p?.playerId;
    }

    // input validation
    let scoreValue = Number(req.body.scoreValue);
    playerId = Number(playerId);

    if (!playerId || isNaN(scoreValue)) {
      return res.status(400).json({ message: "Invalid playerId or scoreValue" });
    }

    // check if player exists
    const player = await Player.findByPk(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    // get beginner level from DB
    const level = await Level.findOne({ where: { name: "beginner" } });
    if (!level) return res.status(404).json({ message: "Beginner level not found" });

    let updatedTotal = null;
    await sequelize.transaction(async (t) => {
      // fix by github copilot: save score as history (always create new row) and update player additively
      // fix by gihub copilot: mirrored comment variant as requested
      await Score.create(
        { playerId, levelId: level.levelId, roundsScore: scoreValue, bonusScore: 0, scoreValue },
        { transaction: t }
      );

      // update player's totalScore and currentLevel (additive)
      const newTotal = player.totalScore + scoreValue;
      await player.update(
        {
          totalScore: newTotal,
          currentLevel: "intermediate"
        },
        { transaction: t }
      );
      updatedTotal = newTotal;
    });

    return res.status(200).json({ message: "Beginner score saved successfully", beginnerTotal: updatedTotal });
  } catch (error) {
    console.error("Error saving beginner score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Save Intermediate Level Score
//(fix by github copilot)
export const saveIntermediateScore = async (req, res) => {
  try {
    let { roundsScore = 0, bonusScore = 0 } = req.body;

    // derive playerId from token if not provided
    const userIdFromToken = req.user?.id;
    const playerRecord = await Player.findOne({where: {userId: userIdFromToken}});
    let playerId = playerRecord.playerId;
    
    if (!playerId && userIdFromToken) {
      const p = await Player.findOne({ where: { userId: userIdFromToken } });
      if (!p) return res.status(404).json({ message: "Player not found" });
      playerId = p.playerId;
    }

    if (!playerId) return res.status(400).json({ message: "playerId required" });

    const player = await Player.findByPk(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const level = await Level.findOne({ where: { name: "intermediate" } });
    if (!level) return res.status(404).json({ message: "Intermediate level not found" });

    // fetch all rounds for intermediate level
    const rounds = await Round.findAll({ where: { levelId: level.levelId } });
    const maxRoundScore = rounds.length * 15;

    // Ensure roundsScore does not exceed max points
    roundsScore = Math.min(Number(roundsScore), maxRoundScore);

    // Calculate bonus points using level.bananaToPoints dynamically
    const bonusBananas = Number(bonusScore) || 0;
    const bonusPoints = Math.floor(bonusBananas / 5) * (level.bananaToPoints || 0);
    const totalScore = Number(roundsScore) + bonusPoints;

    // Check for recent rounds-only row to merge bonus into (avoid double-counting)
    let merged = false;
    let updatedPlayerTotal = null;

    const recentScore = await Score.findOne({
      where: { playerId, levelId: level.levelId, roundsScore: Number(roundsScore), bonusScore: 0 },
      order: [["createdAt", "DESC"]],
    });

    if (recentScore) {
      const ageMs = Date.now() - new Date(recentScore.createdAt).getTime();
      if (ageMs < 10 * 60 * 1000) { // merge if recent within 10 minutes
        await sequelize.transaction(async (t) => {
          const prevValue = Number(recentScore.scoreValue || 0);
          await recentScore.update({ bonusScore: bonusPoints, scoreValue: totalScore }, { transaction: t });

          const delta = totalScore - prevValue;
          const newTotal = player.totalScore + delta;

          await player.update(
            {
              totalScore: newTotal,
              bananaCount: player.bananaCount + bonusBananas,
              currentLevel: newTotal >= level.scoreThreshold ? "advanced" : player.currentLevel
            },
            { transaction: t }
          );

          updatedPlayerTotal = newTotal;
        });
        merged = true;
      }
    }

    // If no recent row to merge, create a new score row
    if (!merged) {
      await sequelize.transaction(async (t) => {
        await Score.create(
          { playerId, levelId: level.levelId, roundsScore, bonusScore: bonusPoints, scoreValue: totalScore },
          { transaction: t }
        );

        const newPlayerTotal = player.totalScore + totalScore;

        await player.update(
          {
            totalScore: newPlayerTotal,
            bananaCount: player.bananaCount + bonusBananas,
            currentLevel: newPlayerTotal >= level.scoreThreshold ? "advanced" : player.currentLevel
          },
          { transaction: t }
        );

        updatedPlayerTotal = newPlayerTotal;
      });
    }

    res.status(200).json({
      message: merged ? "Intermediate score merged" : "Intermediate score saved",
      intermediateTotal: totalScore, // total points for this level
      playerTotal: updatedPlayerTotal,
    });
  } catch (err) {
    console.error("Intermediate save error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Save Advanced Level Score
export const saveAdvancedScore = async (req, res) => {
  try {
    let {roundsScore = 0, bonusScore = 0 } = req.body;

    // derive playerId from token
    const userIdFromToken = req.user?.id;
    const playerRecord = await Player.findOne({where: {userId: userIdFromToken}});
    let playerId = playerRecord.playerId;
    
    if (!playerId && userIdFromToken) {
      const p = await Player.findOne({ where: { userId: userIdFromToken } });
      playerId = p?.playerId;
    }

    if (!playerId) return res.status(400).json({ message: "playerId required" });

    const player = await Player.findByPk(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const level = await Level.findOne({ where: { name: "advanced" } });
    if (!level) return res.status(404).json({ message: "Advanced level not found" });

    // Dynamic bonus points
    const bonusBananas = Number(bonusScore);
    const bonusPoints = Math.floor(bonusBananas / 5) * level.bananaToPoints; // 5 bananas = X points from DB
    const totalScore = Number(roundsScore) + bonusPoints;

    // fix by github copilot: Try to merge into a recent rounds-only row to avoid double-counting (bonusScore === 0)
    // fix by github copilot: When merging we update the existing row's bonusScore and scoreValue
    // and only increase Player.totalScore by the delta so the previously-counted rounds are not added again.
    let merged = false;
    let updatedPlayerTotal = null;
    try {
      const recentRoundOnly = await Score.findOne({
        where: {
          playerId,
          levelId: level.levelId,
          roundsScore: Number(roundsScore),
          bonusScore: 0,
        },
        order: [["createdAt", "DESC"]]
      });

      if (recentRoundOnly) {
        const ageMs = Date.now() - new Date(recentRoundOnly.createdAt).getTime();
        if (ageMs < 10 * 60 * 1000) {
          await sequelize.transaction(async (t) => {
            // fix by github copilot: keep previous stored value, update row, then add only delta to player
            const prevValue = Number(recentRoundOnly.scoreValue || recentRoundOnly.roundsScore || 0);
            await recentRoundOnly.update({ bonusScore: bonusPoints, scoreValue: totalScore }, { transaction: t });
            const delta = totalScore - prevValue;
            const newTotal = player.totalScore + delta;
            await player.update({ totalScore: newTotal, bananaCount: player.bananaCount + bonusBananas, currentLevel: "advanced" }, { transaction: t });
            updatedPlayerTotal = newTotal;
          });
          merged = true;
        }
      }
    } catch (mergeErr) {
      console.warn("Advanced merge check failed, proceeding to create a new row:", mergeErr);
    }

    if (!merged) {
      await sequelize.transaction(async (t) => {
        // fix by github copilot: no merge candidate found; create a new history row and update player additively
        await Score.create({ playerId, levelId: level.levelId, roundsScore: Number(roundsScore), bonusScore: bonusPoints, scoreValue: totalScore }, { transaction: t });
        const updatedTotalScore = player.totalScore + totalScore;
        await player.update({ totalScore: updatedTotalScore, bananaCount: player.bananaCount + bonusBananas, currentLevel: "advanced" }, { transaction: t });
        updatedPlayerTotal = updatedTotalScore;
      });
    }

    res.status(200).json({ message: merged ? "Advanced score merged" : "Advanced score saved", advancedTotal: totalScore, playerTotal: updatedPlayerTotal });
  } catch (err) {
    console.error("Advanced save error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//get level configuration
export const getLevelConfig = async (req, res) => {
  const { levelName } = req.params;

  try {
    const level = await Level.findOne({
      where: { name: levelName },
      attributes: ["name", "scoreThreshold", "bananaToPoints"]
    });

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    res.json({
      levelName: level.name,
      scoreThreshold: level.scoreThreshold,
      bananaToPoints: level.bananaToPoints
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
