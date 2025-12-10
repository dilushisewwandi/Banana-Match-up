import express from "express";
import { getPlayerResult } from "../controllers/playerController.js";

const router = express.Router();

router.get("/:playerId/result", getPlayerResult);

export default router;
