import express from "express";
import {getRoundsByLevel, saveIntermediateScore, saveBeginnerScore, saveAdvancedScore, getLevelConfig } from "../controllers/levelController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/rounds/:levelId", getRoundsByLevel); 

router.post("/save/beginner", verifyToken, saveBeginnerScore);
router.post("/save/intermediate", verifyToken, saveIntermediateScore);
router.post("/save/advanced", verifyToken, saveAdvancedScore); 
// fix by github copilot: expose a simple config route under /api/levels/config/:levelName
router.get("/config/:levelName", getLevelConfig);

// legacy/incorrect route kept for compatibility (some clients might call /api/levels/levels/config/:name)
router.get("/levels/config/:levelName", getLevelConfig);

export default router;