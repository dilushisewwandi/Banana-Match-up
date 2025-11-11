import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  });

  useEffect(() => {
    const beginner = parseInt(localStorage.getItem("beginnerScore")) || 0;
    const intermediate = parseInt(localStorage.getItem("intermediateScore")) || 0;
    const advanced = parseInt(localStorage.getItem("advancedScore")) || 0;
    setScores({ beginner, intermediate, advanced });
  }, []);

  const totalScore = scores.beginner + scores.intermediate + scores.advanced;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start text-yellow-900 font-playful bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-200 overflow-hidden">

      {/* Floating Bananas (4 big ones) */}
      <motion.img
        src="/Assets/images/banana.png"
        alt="banana"
        className="absolute top-16 left-10 w-44 md:w-52 opacity-90"
        animate={{ y: [0, -25, 0], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/Assets/images/banana.png"
        alt="banana"
        className="absolute top-24 right-16 w-48 md:w-56 opacity-85"
        animate={{ x: [0, 20, -20, 0], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/Assets/images/banana.png"
        alt="banana"
        className="absolute bottom-24 left-20 w-48 md:w-56 opacity-85"
        animate={{ y: [0, 20, -20, 0], rotate: [0, -12, 12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/Assets/images/banana.png"
        alt="banana"
        className="absolute bottom-20 right-24 w-52 md:w-60 opacity-80"
        animate={{ y: [0, -15, 15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Score Summary */}
      <motion.div
        className="bg-yellow-50/90 backdrop-blur-md rounded-3xl p-8 w-full max-w-3xl shadow-2xl border-4 border-yellow-300 mt-16 mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-3xl font-bold text-yellow-800 mb-4 text-center">
          Your Progress
        </h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-yellow-200 rounded-2xl py-4 shadow-lg">
            <h3 className="text-xl font-bold text-yellow-900">Beginner</h3>
            <p className="text-3xl font-extrabold text-yellow-800">
              {scores.beginner} 🍌
            </p>
          </div>

          <div className="bg-yellow-200 rounded-2xl py-4 shadow-lg">
            <h3 className="text-xl font-bold text-yellow-900">Intermediate</h3>
            <p className="text-3xl font-extrabold text-yellow-800">
              {scores.intermediate} 🍌
            </p>
          </div>

          <div className="bg-yellow-200 rounded-2xl py-4 shadow-lg">
            <h3 className="text-xl font-bold text-yellow-900">Advanced</h3>
            <p className="text-3xl font-extrabold text-yellow-800">
              {scores.advanced} 🍌
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-2xl font-bold text-yellow-900">
          🏆 Total Score: <span className="text-3xl">{totalScore} 🍌</span>
        </div>
      </motion.div>

      {/* Buttons Section */}
      <div className="flex flex-wrap gap-6 justify-center">
        <motion.button
          onClick={() => navigate("/beginner")}
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-yellow-400 transition"
        >
          ▶ Start Beginner
        </motion.button>

        <motion.button
          onClick={() => navigate("/intermediate")}
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-yellow-400 transition"
        >
          ▶ Start Intermediate
        </motion.button>

        <motion.button
          onClick={() => navigate("/advanced")}
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-300 text-yellow-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-yellow-400 transition"
        >
          ▶ Start Advanced
        </motion.button>
      </div>

      {/* Leaderboard + Logout */}
      <div className="flex gap-6 mt-10">
        <motion.button
          onClick={() => navigate("/leaderboard")}
          whileHover={{ scale: 1.1 }}
          className="bg-amber-200 text-yellow-900 px-8 py-3 rounded-xl font-bold shadow-md hover:bg-amber-300 transition"
        >
          🏅 Leaderboard
        </motion.button>

        <motion.button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-600 text-yellow-100 px-8 py-3 rounded-xl font-bold shadow-md hover:bg-yellow-700 transition"
        >
          🚪 Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Dashboard;
