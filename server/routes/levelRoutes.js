import express from "express";
import {getRoundsByLevel, saveIntermediateScore, saveBeginnerScore, saveAdvancedScore, getLevelConfig } from "../controllers/levelController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

//get rounds by level
router.get("/rounds/:levelId", verifyToken, getRoundsByLevel); 

//save 3 level score routes
router.post("/save/beginner", verifyToken, saveBeginnerScore);
router.post("/save/intermediate", verifyToken, saveIntermediateScore);
router.post("/save/advanced", verifyToken, saveAdvancedScore); 

// fix by github copilot: expose a simple config route under /api/levels/config/:levelName
router.get("/config/:levelName", getLevelConfig);


export default router;