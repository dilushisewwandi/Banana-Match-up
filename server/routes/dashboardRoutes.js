import express from "express";
import { getDashboardData } from "../controllers/dashBoardController.js";

const router = express.Router();

router.get("/", getDashboardData)

export default router;