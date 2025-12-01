import React from "react";
import { motion } from "framer-motion";

const BonusGame = ({ playerId, onComplete }) => {
  const finish = () => onComplete(20);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start text-white overflow-auto"
      style={{
        background: "linear-gradient(to bottom, #d9f99d, #a7f3d0, #fef08a)",
      }}
    >
      {/* Bananas in corners */}
      <img src="/Assets/images/Banana.png" alt="banana" className="absolute w-40 md:w-48 top-5 left-5" />
      <img src="/Assets/images/Banana.png" alt="banana" className="absolute w-40 md:w-48 top-5 right-5" />
      <img src="/Assets/images/Banana.png" alt="banana" className="absolute w-40 md:w-48 bottom-5 left-5" />
      <img src="/Assets/images/Banana.png" alt="banana" className="absolute w-40 md:w-48 bottom-5 right-5" />

      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Title */}
      <motion.h1
        className="relative text-5xl md:text-6xl font-extrabold mb-6 text-center"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          color: "#3d2a00",
          textShadow: "2px 2px 4px #fff",
        }}
      >
        🍌 Banana Math Challenge 🍌
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="relative text-lg md:text-xl mb-6 text-center"
        style={{ fontFamily: "'Cursive', cursive", color: "#ffffff" }}
      >
        Solve the mini-game to earn bonus points!
      </motion.p>

      {/* FIXED GAME BOX */}
      <motion.div
        className="relative shadow-2xl rounded-2xl border-8 border-yellow-400 w-[90%] max-w-[1100px] bg-black/30"
        style={{
          height: "600px",     
          overflow: "hidden",  
        }}
      >
        <iframe
          src="https://marcconrad.com/uob/banana/"
          title="Banana Math Game"
          className="w-full h-full rounded-2xl border-0"
          style={{
            transform: "scale(1)",
            transformOrigin: "top left",
          }}
        />
      </motion.div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col items-center gap-4 relative z-10 mb-8">
        <button
          className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-2xl hover:bg-yellow-500 transition-all"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
          onClick={finish}
        >
          Finish & Claim 20 Bonus Points
        </button>

        <button
          className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-xl shadow-lg"
          onClick={() => onComplete(0)}
        >
          Finish without Bonus
        </button>
      </div>
    </div>
  );
};

export default BonusGame;

