import express from "express";
import { saveBeginnerScore } from "../controllers/levelController.js";

const router = express.Router();

router.post("/beginner", saveBeginnerScore);

export default router;
