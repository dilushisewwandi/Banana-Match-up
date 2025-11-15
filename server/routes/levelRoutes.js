import express from "express";
import { saveBeginnerScore, saveIntermediateScore } from "../controllers/levelController.js"

const router = express.Router();

router.post("/beginner", saveBeginnerScore);
router.post("/intermediate", saveIntermediateScore);

export default router;
