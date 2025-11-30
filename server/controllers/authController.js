import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserModel.js"; 
import { Player } from "../models/PlayerModel.js";

dotenv.config();

// SIGNUP
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //Create player (ensures every new user gets a player profile)
    await Player.create({
    userId: newUser.userId,
    totalScore: 0,
    bananaCount: 0, 
    level: "beginner",
  });

    return res.status(201).json({ message: "User registered successfully!", userId: newUser.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while registering user." });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //fetch player
    const player = await Player.findOne({ where: { userId: user.userId } });

    if (!player) {
      return res.status(404).json({ message: "Player profile missing" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.userId, email:user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
   return res.json({ message: "Login successful", 
    token, 
    player:{
      userId: player.userId, 
      playerId: player.playerId,
      totalScore:player.totalScore,
      bananaCount:player.bananaCount,
      level:player.level
    }
    
  });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error while logging in" });
  }
};
