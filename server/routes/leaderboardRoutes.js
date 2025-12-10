import express from "express";
import { getLeaderboard } from "../controllers/leaderBoardController.js";


const router = express.Router();

router.get("/", getLeaderboard);

export default router;
