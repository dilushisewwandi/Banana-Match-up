import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserModel.js"; 
import { Player } from "../models/PlayerModel.js";

dotenv.config();

// SIGNUP
export const signup = async (req, res) => {
  let{ username, email, password } = req.body;

  try {

    //avoid spaces
    username = username?.trim();
    email = email?.trim();
    password = password?.trim();

    //validate username
    if(!username || username.length <3){
      return res.status(400).json({message:"🍌 Hey! Your name is too tiny to swing!"});
    }

    //validate email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!email || !emailRegex.test(email)){
      return res.status(400).json({message:"🍃 That email smells like rotten bananas!"});
    }

    //password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if(!password || !passwordRegex.test(password)){
      return res.status(400).json({message:"🐵 Weak password! Even monkeys can guess that!"});
    }

    //user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "🦜 That email already has a banana backpack!" });
    }

    //password hashing
    const hashedPassword = bcrypt.hashSync(password, 10);

    //create new user
    const newUser = await User.create({username,email,password: hashedPassword,});

    //create player (every new user gets a player profile)
    await Player.create({
      userId: newUser.userId,
      totalScore: 0,
      bananaCount: 0, 
      level: "beginner",
  });

    return res.status(201).json({ message: "🎉 Woohoo! You’re in the Banana Jungle!", userId: newUser.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "🌪️ Oops! The monkeys messed up the server!" });
  }
};

// LOGIN
export const login = async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim();
  password = password?.trim();

  try {
    if(!email || !password){
      return res.status(400).json({message:"🌴 You need both email & key to swing!"});
    }
    //find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "🦁 No explorer found here!" });
    }

    //validate password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "🐵 Wrong key! Monkeys are laughing!" });
    }

    //fetch player
    const player = await Player.findOne({ where: { userId: user.userId } });

    if (!player) {
      return res.status(404).json({ message: "🌱 Player lost in the jungle!" });
    }

    //create JWT token
    const token = jwt.sign(
      { id: user.userId, email:user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

   return res.json({ message: "🌟 Welcome back, banana champ! 🍌", 
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
    return res.status(500).json({ message: "🌪️ Jungle chaos! Try again later!" });
  }
};
