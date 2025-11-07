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
};
