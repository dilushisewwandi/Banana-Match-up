import Level from '../models/LevelModel.js';
import { Player } from '../models/PlayerModel.js';
import { Score } from '../models/ScoreModel.js';

//get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const userIdFromToken = req.user.id;
        const player = await Player.findOne({where: {userId: userIdFromToken}});

        if(!player){
            return res.status(404).json({error: "Player not found"});
        }

        const playerId = player.playerId;

        // Fetch total player score per level
        const beginnerScore = await Score.sum('scoreValue', { where: { playerId}, include: [{model: Level, where:{name: "beginner"}}] }) || 0;
        const intermediateScore = await Score.sum('scoreValue', {where: {playerId}, include: [{model: Level, where:{name: "intermediate"}}] }) || 0;
        const advancedScore = await Score.sum('scoreValue', {where: {playerId}, include: [{model: Level, where:{name: "advanced"}}] }) || 0;

        const totalScore = beginnerScore + intermediateScore + advancedScore;

        const currentLevel = await Level.findOne({ where: { name: player.currentLevel } });
        let nextLevel = null;
        if (currentLevel) {
            nextLevel = await Level.findOne({ where: { order: currentLevel.order + 1 } });
        }

        let pointsToNext = 0;

        // fix by gihub copilot: added nextLevel and pointsToNext calculation for dashboard progress
        if (nextLevel){
            if(player.currentLevel === "beginner"){
                if(nextLevel.name === "intermediate"){
                    pointsToNext = Math.max(0, nextLevel.scoreThreshold - beginnerScore);
                }

                if(nextLevel.name === "advanced"){
                    pointsToNext = Math.max(0, nextLevel.scoreThreshold - intermediateScore);
                }
            }

            if(player.currentLevel === "intermediate"){
                if(nextLevel.name === "advanced"){
                    pointsToNext = Math.max(0, nextLevel.scoreThreshold -intermediateScore);
                }
            }
        }

    
        res.status(200).json({
            beginner: beginnerScore,
            intermediate: intermediateScore,
            advanced: advancedScore,
            totalScore,
            currentLevel: player.currentLevel,
            nextLevel,
            pointsToNext,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}