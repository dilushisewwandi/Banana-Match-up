import React, { useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const LevelComplete = ({ score = 0, bonus = 0, unlockScore, playerId, onBack }) => {
  const total = score + bonus;
  const unlocked = total >= unlockScore;

  useEffect(() => {
    if (!playerId) {
      console.error("Player ID missing. Score not saved.");
      return;
    }

  // Save on mount
    const save = async () => {
      try {
        await axios.post("http://localhost:5000/api/level/intermediate", {
          playerId,
          scoreValue: total,
        });
        console.log("Saved intermediate final score:", total);
      } catch (err) {
        console.error("Error saving final score", err);
      }
    };
    save();
  }, [playerId, total]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/Assets/images/Loading.jpg')", backgroundColor: "rgba(0,0,0,0.5)", backgroundBlendMode: "overlay" }}
    >
      <motion.h1 className="text-5xl font-bold mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
        🎉 Intermediate Level Complete!
      </motion.h1>

      <motion.p className="text-2xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Your Score: {score} 🍌 + Bonus: {bonus} 🔢 = <strong>{total}</strong>
      </motion.p>

      {unlocked ? (
        <motion.div className="text-3xl text-green-400 font-bold mb-6" initial={{ y: 20 }} animate={{ y: 0 }}>
          ⭐ You unlocked the Advanced Level!
        </motion.div>
      ) : (
        <motion.div className="text-2xl text-yellow-300 font-bold mb-6" initial={{ y: 20 }} animate={{ y: 0 }}>
          You need <strong>{unlockScore - total}</strong> more points to unlock Advanced Level.
        </motion.div>
      )}

      <button
        onClick={onBack}
        className="bg-yellow-400 text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Back to Dashboard ⬅
      </button>
    </div>
  );
};

export default LevelComplete;
