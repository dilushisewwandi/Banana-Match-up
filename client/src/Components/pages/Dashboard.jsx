import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("Player");
  const [scores, setScores] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  });

  useEffect(() => {
    // 🧠 Load saved scores from localStorage
    const savedName = localStorage.getItem("playerName");
    const beginner = parseInt(localStorage.getItem("beginnerScore")) || 0;
    const intermediate = parseInt(localStorage.getItem("intermediateScore")) || 0;
    const advanced = parseInt(localStorage.getItem("advancedScore")) || 0;

    if (savedName) setPlayerName(savedName);
    setScores({ beginner, intermediate, advanced });
  }, []);

  const totalScore = scores.beginner + scores.intermediate + scores.advanced;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start text-white p-10"
      style={{
        backgroundImage: "url('/Assets/images/Loading.jpg')",
        backgroundColor: "rgba(0,0,0,0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Title */}
      <motion.h1
        className="text-5xl font-bold mb-6 text-yellow-300 drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🍌 Welcome, {playerName}! 🐵
      </motion.h1>

      {/* Score Summary */}
      <motion.div
        className="bg-yellow-100/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-3xl shadow-2xl border-4 border-yellow-400 mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
          Your Progress
        </h2>

        {/* Level Scores */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-yellow-300 rounded-2xl py-4 shadow-lg">
            <h3 className="text-xl font-bold text-yellow-900">Beginner</h3>
            <p className="text-3xl font-extrabold text-green-800">
              {scores.beginner} 🍌
            </p>
          </div>

          <div className="bg-yellow-300 rounded-2xl py-4 shadow-lg">
            <h3 className="text-xl font-bold text-yellow-900">Intermediate</h3>
            <p className="text-3xl font-extrabold text-green-800">
              {scores.intermediate} 🍌
            </p>
          </div>

          <div className="bg-yellow-300 rounded-2xl py-4 shadow-lg">
            <h3 className="text-xl font-bold text-yellow-900">Advanced</h3>
            <p className="text-3xl font-extrabold text-green-800">
              {scores.advanced} 🍌
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="text-center mt-6 text-2xl font-bold text-green-900">
          🏆 Total Score: <span className="text-3xl">{totalScore} 🍌</span>
        </div>
      </motion.div>

      {/* Level Buttons */}
      <div className="flex flex-wrap gap-6 justify-center">
        <motion.button
          onClick={() => navigate("/beginner")}
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-yellow-500 transition"
        >
          ▶ Start Beginner
        </motion.button>

        <motion.button
          onClick={() => navigate("/intermediate")}
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-yellow-500 transition"
        >
          ▶ Start Intermediate
        </motion.button>

        <motion.button
          onClick={() => navigate("/advanced")}
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-yellow-500 transition"
        >
          ▶ Start Advanced
        </motion.button>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
        className="mt-10 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Dashboard;
