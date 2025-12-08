import express from "express";
import {getRoundsByLevel, saveIntermediateScore, saveBeginnerScore } from "../controllers/levelController.js";
const router = express.Router();

router.get("/rounds/:levelId", getRoundsByLevel); 

router.post("/save/beginner", saveBeginnerScore);
router.post("/save/intermediate", saveIntermediateScore);
// router.post("/save/advanced", saveAdvancedScore); 

export default router;