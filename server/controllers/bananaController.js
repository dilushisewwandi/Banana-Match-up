import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { BananaGame } from "../models/index.js";

//get new banana puzzle from external api
export const getNewBananaPuzzle = async (req,res) => {
  try{
    //fetch CSV data
    const apiRes = await axios.get("https://marcconrad.com/uob/banana/api.php?out=csv&base64=yes");

    //API response validation
    if (!apiRes.data || !apiRes.data.includes(",")) {
      return res.status(500).json({ message: "Invalid API response" });
    }
    
    const data = apiRes.data.split(",");
    const base64Img = data[0];

    //get puzzle answer
    const solution = parseInt(data[1],10);

    //playerId from JWT token
    const playerId = req.user?.id;
    if(!playerId){
      return res.status(401).json({message: "Unauthorized"});
    }

    //puzzle save in database(this expire in 10 min)
    const game = await BananaGame.create({
      gameId: uuidv4(),
      playerId,
      solution,
      expiredAt: new Date(Date.now() + 10*60*1000),
    });

    res.json({gameId: game.gameId, imageData: `data:image/png;base64,${base64Img}`});
  } catch(err){
    console.error(err);
    res.status(500).json({message:"Failed to fetch puzzle"});
  }
};

//banana puzzle answer submit
export const submitBananaAnswer = async (req,res) => {
  try {
    const { gameId, answer } = req.body;

    const playerId = req.user?.id;
      if(!playerId){
        return res.status(401).json({message: "Unauthorized"});
      }

    const game = await BananaGame.findByPk(gameId);

    if (!game) return res.status(404).json({ message:"Game not found"});
    if (game.used) return res.status(400).json({ message:"Game already used"});
    if (game.expiredAt && game.expiredAt < new Date()) return res.status(410).json({ message:"Game expired" });

    
    const correct = Number(answer) === Number(game.solution);
    await game.update({ used:true });
    const bananasEarned = correct ? 5 : 0;

    res.json({ correct, bananasEarned });
  } catch(err){
    console.error(err);
    res.status(500).json({ message:"Server error" });
  }
};