import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  // Example player data
  const playerName = "Dilushi";
  const level = 3;
  const score = 1240;

  //Page interface
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-lime-100 via-green-100 to-yellow-100 overflow-hidden font-playful">
      
      {/* Animated Background Bananas */}
      <img
        src="/Assets/images/Banana.png"
        alt="banana"
        className="absolute w-64 md:w-80 top-10 left-16 opacity-25 animate-bounce"
      />
      <img
        src="/Assets/images/Banana.png"
        alt="banana"
        className="absolute w-72 md:w-96 bottom-20 right-20 opacity-30 animate-spin-slow"
      />

      {/* Main Welcome Section */}
      <div className="z-10 text-center space-y-6 px-4 drop-shadow-xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-lime-700 animate-bounce">
          🍌 Welcome, {playerName}! 🍌
        </h1>

        <p className="text-2xl md:text-3xl text-green-700 font-semibold animate-pulse">
          Ready to flex your fruit-fueled brain power?
        </p>

        {/* Start Game Button */}
        <h2
          onClick={() => navigate("/levels")}
          className="mt-8 text-5xl md:text-6xl font-extrabold text-yellow-600 hover:text-yellow-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:rotate-2 drop-shadow-lg"
        >
          ✨ Tap to Play ✨
        </h2>
      </div>

      {/* Info Box with Level and Score */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end z-10">
        <div className="bg-gradient-to-r from-yellow-200 to-lime-200 rounded-2xl p-4 shadow-[0_0_25px_rgba(180,255,120,0.4)] border-4 border-lime-400 transform hover:scale-105 transition-all duration-300">
          <p className="text-xl md:text-2xl font-extrabold text-green-800 drop-shadow-sm">
            🌿 Level: <span className="text-lime-700">{level}</span>
          </p>
          <p className="text-xl md:text-2xl font-extrabold text-green-800 drop-shadow-sm">
            🍇 Score: <span className="text-lime-700">{score}</span>
          </p>
        </div>
      </div>

      {/* Levels Navigation Button */}
      <button
        onClick={() => navigate("/levels")}
        className="absolute bottom-6 left-6 bg-gradient-to-r from-lime-500 to-yellow-400 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(255,255,100,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(255,255,150,0.5)] transition-all duration-300"
      >
        🕹️ Levels
      </button>
    </div>
  );
};

export default WelcomePage;
