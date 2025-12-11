import express from "express";
import { getDashboardData } from "../controllers/dashBoardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

//get dashboard
router.get("/", verifyToken, getDashboardData)

export default router;