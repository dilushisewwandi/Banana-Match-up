import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

//Winning page component
const WinningPage = ({ playerName = "Dilushi", score = 1240 }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-lime-100 via-green-200 to-yellow-100 font-playful overflow-hidden">
      
      {/* Animated Background Bananas */}
      <motion.img
        src="/Assets/images/Banana.png"
        alt="banana"
        className="absolute top-10 left-10 w-32 md:w-40 opacity-30"
        animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <motion.img
        src="/Assets/images/Banana.png"
        alt="banana"
        className="absolute bottom-10 right-10 w-32 md:w-40 opacity-30"
        animate={{ y: [0, -20, 0], rotate: [0, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      {/* Monkey Swinging in Background */}
      <motion.img
        src="/Assets/images/cartoon-monkey.png"
        alt="monkey"
        className="absolute top-1/4 right-10 w-32 md:w-40 opacity-50"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />

      {/* Main Congratulatory Section */}
      <motion.div
        className="z-10 text-center space-y-6 px-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-lime-700 animate-bounce">
          🎉 Congratulations, {playerName}! 🎉
        </h1>

        <p className="text-3xl md:text-4xl text-green-800 font-semibold animate-pulse">
          You scored {score} points!
        </p>

        <h2 className="text-4xl md:text-5xl text-yellow-600 font-bold animate-fadeIn">
          🍌 You are the Banana Master! 🍌
        </h2>

        {/* Play Again Button */}
        <motion.button
          onClick={() => navigate("/levels")}
          className="mt-6 px-6 py-3 bg-yellow-400 text-green-900 font-bold rounded-xl shadow-lg hover:bg-yellow-300 transform hover:scale-110 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Play Again
        </motion.button>
      </motion.div>

      {/* Confetti animation */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-yellow-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
          animate={{ y: [0, 300], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, delay: Math.random() }}
        />
      ))}
    </div>
  );
};

export default WinningPage;
