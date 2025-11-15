import express from "express";
import { getBonusChallenge, submitBonusScore } from "../controllers/bonusController.js";

const router = express.Router();

//get bonus challenge
router.get("/challenge", getBonusChallenge);

//save bonus score
router.post("/submit", submitBonusScore);

export default router;