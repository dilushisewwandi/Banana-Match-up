import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const WinningPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const playerId =
    location.state?.playerId || localStorage.getItem("playerId");

  const [playerName, setPlayerName] = useState("Player");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/players/${playerId}/result`
        );

        setPlayerName(res.data.playerName);
        setScore(res.data.score);
      } catch (err) {
        console.error("Failed to load player result");
      } finally {
        setLoading(false);
      }
    };

    if (playerId) fetchResult();
  }, [playerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading results...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 via-orange-200 to-yellow-300 font-playful overflow-hidden">

      {/* Floating Bananas */}
      {[...Array(14)].map((_, i) => (
        <motion.img
          key={i}
          src="/Assets/images/Banana.png"
          className="absolute w-12 opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
          animate={{
            y: [0, Math.random() * 40, 0],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + Math.random() * 3,
            delay: Math.random(),
          }}
        />
      ))}

      {/* Fireworks */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 rounded-full border-4 border-yellow-400"
          style={{
            left: `${20 + i * 30}%`,
            top: "20%",
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Jumping Monkey */}
      <motion.img
        src="/Assets/images/cartoon-monkey.png"
        className="absolute top-10 right-10 w-40 drop-shadow-xl"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
      />

      {/* Main Winning Card */}
      <motion.div
        className="z-10 bg-white/70 backdrop-blur-xl px-10 py-8 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center space-y-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🎉 YOU WIN! 🎉
        </motion.h1>

        <h2 className="text-3xl md:text-4xl text-yellow-800 font-bold">
          {playerName}, you're incredible!
        </h2>

        <motion.p
          className="text-5xl md:text-6xl font-extrabold text-green-800"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ⭐ Score: {score} ⭐
        </motion.p>

        <h2 className="text-3xl md:text-4xl font-bold text-orange-600">
          🍌 Ultimate Banana Champion 🍌
        </h2>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">

          <motion.button
            onClick={() => navigate("/leaderboard")}
            whileHover={{ scale: 1.15 }}
            className="bg-yellow-300 px-8 py-3 rounded-2xl font-bold text-yellow-900 shadow-lg hover:bg-yellow-200"
          >
            🏆 Leaderboard
          </motion.button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.15 }}
            className="bg-green-400 px-8 py-3 rounded-2xl font-bold text-green-900 shadow-lg hover:bg-green-300"
          >
            🔁 Play Again
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default WinningPage;
