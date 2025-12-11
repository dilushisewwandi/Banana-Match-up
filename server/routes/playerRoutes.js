import express from "express";
import { getPlayerResult } from "../controllers/playerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

//get player
router.get("/:playerId/result", verifyToken, getPlayerResult);

export default router;
