<<<<<<< HEAD
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//Signup
export const signup = (req, res) => {
    const {username, email, password} = req.body;

    //Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
    db.query(query, [username, email, hashedPassword], (err) => {
        if(err) return res.status(500).json({error: err});
        res.status(201).json({message: "User registered successfully!"});
    });
};


//Login
export const login = (req, res) =>{
    const {email, password} = req.body;
    const query = "SELECT * FROM users WHERE email = ?"

    db.query(query, [email], (err, results) =>{
        if (err) return res.status(500).json ({error: err});
        if(results.lengh === 0) return res.status(404).json({message: "User not found"});

        const user = results[0];
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) return res.status(401).json({message: "Invalid credentials"});

        const token = jwt.sign({id: user.userID, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1hr"});
        res.json({message:"Login successfull", token});
    });
=======
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserModel.js"; 

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

    res.status(201).json({ message: "User registered successfully!", userId: newUser.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while registering user." });
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

    // Compare password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.userId, email:user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while logging in" });
  }
>>>>>>> auth
};
