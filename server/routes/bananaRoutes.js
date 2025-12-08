import express from "express";
import { getNewBananaPuzzle, submitBananaAnswer } from "../controllers/bananaController.js";

const router = express.Router();

router.get("/new", getNewBananaPuzzle);
router.post("/submit", submitBananaAnswer);

export default router;
