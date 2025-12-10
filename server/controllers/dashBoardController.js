import { where } from 'sequelize';
import Level from '../models/LevelModel.js';
import { Player } from '../models/PlayerModel.js';
import { Score } from '../models/ScoreModel.js';

export const getDashboardData = async (req, res) => {
    try {
        const playerId = req.query.playerId;

        if(!playerId){
            return res.status(400).json({error: "playerId is required"});
        }

        // Fetch total player score per level
        const beginnerScore = await Score.sum('scoreValue', { where: { playerId}, include: [{model: Level, where:{name: "beginner"}}] }) || 0;
        const intermediateScore = await Score.sum('scoreValue', {where: {playerId}, include: [{model: Level, where:{name: "intermediate"}}] }) || 0;
        const advancedScore = await Score.sum('scoreValue', {where: {playerId}, include: [{model: Level, where:{name: "advanced"}}] }) || 0;

        const totalScore = beginnerScore + intermediateScore + advancedScore;

        //fetch player's current level
        const player = await Player.findByPk(playerId);
        if(!player) return res.status(404).json({error:"player not found"});
        // determine next level (by order)
        const currentLevel = await Level.findOne({ where: { name: player.currentLevel } });
        let nextLevel = null;
        if (currentLevel) {
            nextLevel = await Level.findOne({ where: { order: currentLevel.order + 1 } });
        }

            // fix by gihub copilot: added nextLevel and pointsToNext calculation for dashboard progress

        res.status(200).json({
            beginner: beginnerScore,
            intermediate: intermediateScore,
            advanced: advancedScore,
            totalScore,
            currentLevel: player.currentLevel,
            nextLevel: nextLevel ? { levelId: nextLevel.levelId, name: nextLevel.name, scoreThreshold: nextLevel.scoreThreshold } : null,
            pointsToNext: nextLevel ? Math.max(0, nextLevel.scoreThreshold - totalScore) : 0,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}