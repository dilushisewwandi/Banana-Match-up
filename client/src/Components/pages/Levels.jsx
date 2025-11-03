import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const levels = [
  { id: 1, name: "Beginner", unlocked: true, completed: false },
  { id: 2, name: "Intermediate", unlocked: false, completed: false },
  { id: 3, name: "Advanced", unlocked: false, completed: false },
];

const LevelsPage = () => {
  const navigate = useNavigate();

  //Level click handle
  const handleLevelClick = (level) => {
    // if (level.unlocked) navigate(`/level/${level.id}`);
    if (level.unlocked) navigate(`/level/${level.id}`);
  };

  //Game UI
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-lime-100 via-green-100 to-yellow-100 overflow-hidden font-playful">
      
      {/* Page Title */}
      <motion.h1
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-extrabold text-lime-700 mb-10 drop-shadow-lg text-center z-10"
      >
        🍌 Select Your Level 🍌
      </motion.h1>

      {/* Monkeys */}
      <motion.img
        src="/Assets/images/cartoon-monkey.png"
        alt="monkey"
        className="absolute top-24 left-6 w-36 md:w-44 opacity-70"
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/Assets/images/cartoon-monkey.png"
        alt="monkey"
        className="absolute top-32 right-10 w-40 md:w-48 opacity-70"
        animate={{ x: [0, 15, -15, 0], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/Assets/images/cartoon-monkey.png"
        alt="monkey"
        className="absolute bottom-36 left-16 w-44 md:w-52 opacity-60"
        animate={{ y: [0, -18, 0], rotate: [0, 12, -12, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/Assets/images/cartoon-monkey.png"
        alt="monkey"
        className="absolute bottom-32 right-28 w-48 md:w-56 opacity-60"
        animate={{ x: [0, 20, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/*Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 z-10">
        {levels.map((level, index) => (
          <motion.div
            key={level.id}
            onClick={() => handleLevelClick(level)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.3, type: "spring", stiffness: 80 }}
            whileHover={
              level.unlocked
                ? { scale: 1.1, rotate: [0, -3, 3, 0], transition: { duration: 0.3 } }
                : {}
            }
            className={`relative w-52 h-52 md:w-60 md:h-60 rounded-3xl shadow-xl cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
              level.unlocked
                ? "bg-gradient-to-br from-yellow-200 to-lime-200 hover:shadow-2xl"
                : "bg-gray-300 opacity-60 cursor-not-allowed"
            }`}
          >
            <h2 className="text-xl md:text-2xl text-green-900 font-bold z-10">
              {level.name}
            </h2>
            {level.completed && (
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-3 right-3 text-green-900 text-2xl"
              >
                🏆
              </motion.span>
            )}
            {!level.unlocked && (
              <span className="absolute top-3 right-3 text-red-600 text-2xl animate-pulse">
                🔒
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/*Bottom Grass */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center overflow-hidden z-0">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <img
              key={i}
              src="/Assets/images/grass.png"
              alt="grass"
              className="w-56 md:w-72 h-auto -mb-2 object-cover opacity-90"
            />
          ))}
      </div>

    </div>
  );
};

export default LevelsPage;
