import express from "express";
import { getUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router =  express.Router();

//get user
router.get("/", verifyToken, getUser);

export default router;