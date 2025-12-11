import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LevelComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const level = state.level || "beginner";

  const targetScore = state.score ?? 0;
  const targetBonusBananas = state.bonusBananas ?? 0;
  const targetBonusPoints = state.bonusPoints ?? 0;
  const targetTotal = state.intermediateTotal ?? targetScore;
  const unlocked = state.unlocked ?? false;

  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedBonus, setAnimatedBonus] = useState(0);
  const [animatedBonusPoints, setAnimatedBonusPoints] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // Count up animation
  useEffect(() => {
    let score = 0, bonus = 0, bonusPoints = 0, total = 0;

    const interval = setInterval(() => {
      if (score < targetScore) score++;
      if (bonus < targetBonusBananas) bonus++;
      if (bonusPoints < targetBonusPoints) bonusPoints++;
      if (total < targetTotal) total++;

      setAnimatedScore(score);
      setAnimatedBonus(bonus);
      setAnimatedBonusPoints(bonusPoints);
      setAnimatedTotal(total);

      if (
        score >= targetScore &&
        bonus >= targetBonusBananas &&
        bonusPoints >= targetBonusPoints &&
        total >= targetTotal
      ) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [targetScore, targetBonusBananas, targetBonusPoints, targetTotal]);

  //handle navigation(based on completed level)
  const handleNext = () => {
    if (level === "beginner") {
      navigate("/intermediate");
    } else if (level === "intermediate") {
      unlocked ? navigate("/advanced") : navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  //UI
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 overflow-hidden text-gray-800">

      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: ["-10%", "110%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute text-3xl pointer-events-none"
          style={{ left: `${Math.random() * 100}%` }}
        >
          🍌
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="z-10 bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-4 border-yellow-300 w-full max-w-xl text-center"
      >
        <motion.h1
          className="text-4xl font-extrabold mb-4 text-yellow-600"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          🎉 LEVEL COMPLETE 🎉
        </motion.h1>

        {level === "beginner" && (
          <p className="text-xl font-bold text-green-600 mb-4">
            ✅ INTERMEDIATE LEVEL UNLOCKED!
          </p>
        )}

        {level === "intermediate" && (
          unlocked ? (
            <p className="text-xl font-bold text-green-600 mb-4">
              ✅ ADVANCED LEVEL UNLOCKED!
            </p>
          ) : (
            <p className="text-xl font-bold text-red-500 mb-4">
              ⚠️ ADVANCED NOT UNLOCKED – TRY AGAIN!
            </p>
          )
        )}

        <div className="space-y-3 text-2xl font-bold mt-6">
          <p>🍌 Rounds Score: <span className="text-orange-500">{animatedScore}</span></p>
          <p>🍌 Bonus Bananas: <span className="text-orange-500">{animatedBonus}</span></p>
          <p>⭐ Bonus Points: <span className="text-orange-500">{animatedBonusPoints}</span></p>
          <p className="text-3xl mt-4 text-green-700">
            🏆 TOTAL SCORE: <span>{animatedTotal}</span>
          </p>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-lg"
          >
            CONTINUE ➜
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-white text-gray-800 font-bold rounded-xl shadow-lg border"
          >
            DASHBOARD
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelComplete;
