import express from "express";
import { getNewBananaPuzzle, submitBananaAnswer } from "../controllers/bananaController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

//get new banana puzzle
router.get("/new",verifyToken, getNewBananaPuzzle);

//submit banana answer
router.post("/submit", verifyToken, submitBananaAnswer);

export default router;