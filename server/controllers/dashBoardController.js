import { Player } from '../models/PlayerModel.js';
import { Score } from '../models/ScoreModel.js';

export const getDashboardData = async (req, res) => {
    try {
        // Fetch total players
        const totalPlayers = await Player.count();

        //Fetch total scores
        const totalScores = await Score.count();
        
        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data:{
                totalPlayers,
                totalScores,
            },

        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}