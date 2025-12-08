import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { BananaGame } from "../models/index.js";

export const getNewBananaPuzzle = async (req,res) => {
  try{
    const apiRes = await axios.get("https://marcconrad.com/uob/banana/api.php?out=csv&base64=yes");

    if (!apiRes.data || !apiRes.data.includes(",")) {
      return res.status(500).json({ message: "Invalid API response" });
    }
    
    const data = apiRes.data.split(",");
    const base64Img = data[0];
    const solution = parseInt(data[1],10);

    const game = await BananaGame.create({
      gameId: uuidv4(),
      playerId : req.query.playerId || null,
      solution,
      expiredAt: new Date(Date.now() + 10*60*1000),
    });

    res.json({gameId: game.gameId, imageData: `data:image/png;base64,${base64Img}`});
  } catch(err){
    console.error(err);
    res.status(500).json({message:"Failed to fetch puzzle"});
  }
};

export const submitBananaAnswer = async (req,res) => {
  try {
    const { gameId, answer } = req.body;
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
