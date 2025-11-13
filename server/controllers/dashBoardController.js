import { Player } from '../models/PlayerModel.js';
import { Score } from '../models/ScoreModel.js';

export const getDashboardData = async (req, res) => {
    try {
        const playerId = req.query.playerId;

        // Fetch total player score per level
        const beginnerScore = await Score.sum('scoreValue', { where: { playerId, level: 'beginner' } }) || 0;
        const intermediateScore = await Score.sum('scoreValue', {where: {playerId, level: 'intermediate'}}) || 0;
        const advancedScore = await Score.sum('scoreValue', {where: {playerId, level: 'advanced'}}) || 0;

        const totalScore = beginnerScore + intermediateScore + advancedScore;
        
        res.status(200).json({
            beginner: beginnerScore,
            intermediate: intermediateScore,
            advanced: advancedScore,
            totalScore
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}