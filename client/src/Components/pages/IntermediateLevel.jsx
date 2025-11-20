import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BonusGame from "./BonusGame";
import LevelComplete from "./LevelComplete";

const SCORE_THRESHOLD = 90; 
const BONUS_POINTS = 20; 

const IntermediateLevel = () => {
  const navigate = useNavigate();

  // State Management
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isBonusActive, setBonusActive] = useState(false);

  const [rounds] = useState([
    { clue: "A fruit known as the king of fruits in Asia", options: ["Mango", "Durian", "Papaya", "Lychee", "Banana", "Jackfruit"], answer: "Durian" },
    { clue: "A fruit high in vitamin C, often green or purple", options: ["Grapes", "Kiwi", "Orange", "Guava", "Lime", "Starfruit"], answer: "Kiwi" },
    { clue: "A tropical fruit with spiky skin and sweet yellow flesh", options: ["Pineapple", "Mango", "Jackfruit", "Papaya", "Lychee", "Banana"], answer: "Pineapple" },
    { clue: "Small red berries, often used in pies and jams", options: ["Strawberry", "Raspberry", "Cranberry", "Cherry", "Gooseberry", "Lingonberry"], answer: "Raspberry" },
    { clue: "A fruit often confused with vegetables, purple outside, green inside", options: ["Eggplant", "Plum", "Passionfruit", "Avocado", "Figs", "Okra"], answer: "Passionfruit" },
    { clue: "A yellow tropical fruit that's curved and sweet", options: ["Banana", "Plantain", "Mango", "Papaya", "Pineapple", "Durian"], answer: "Banana" },
  ]);

  // Timer logic 
  useEffect(() => {
    if (levelComplete || isBonusActive) return;

    if (timer === 0) {
      setFeedback("Time's up! ⏰");
      setTimeout(() => nextRound(), 1000);
      return;
    }

    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer, levelComplete, isBonusActive]);

  // Handle answer selection
  const handleSelect = (option) => {
    if (selected || isBonusActive) return;
    setSelected(option);

    if (option === rounds[currentRound].answer) {
      setScore(prev => prev + 15);
      setFeedback("Correct! +15 🍌");
    } else {
      setFeedback("Wrong! ❌ No points for this round");
    }

    setTimeout(() => nextRound(), 1000);
  };

  // Move to next round or trigger bonus game 
  const nextRound = () => {
    setSelected(null);
    setFeedback("");
    setTimer(60);

    if (currentRound >= rounds.length - 1) {
      // All rounds finished → show BONUS
      setBonusActive(true);
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  const handleBonusComplete = (points) => {
    setBonusScore(points);
    setBonusActive(false);
    setLevelComplete(true);
  };

  // Render BonusGame only
  if (isBonusActive) {
    return (
      <BonusGame
        playerId={localStorage.getItem("playerId")}
        onComplete={() => handleBonusComplete(BONUS_POINTS)} 
      />
    );
  }

  // Render LevelComplete screen
  if (levelComplete) {
    return (
      <LevelComplete
        score={score}
        bonus={bonusScore}
        unlockScore={SCORE_THRESHOLD}
        playerId={localStorage.getItem("playerId")}
        onBack={() => navigate("/dashboard")}
      />
    );
  }

  // Game UI 
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-between text-white py-10"
      style={{ backgroundImage: "url('/Assets/images/Loading.jpg')", backgroundColor: "rgba(0,0,0,0.6)", backgroundBlendMode: "overlay" }}
    >
      {/* Score & Timer */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="absolute left-6 top-1/3 transform -translate-y-1/2 bg-yellow-200/90 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center"
      >
        <div className="text-6xl mb-2 animate-bounce">🐵</div>
        <div className="text-2xl font-extrabold text-yellow-800 tracking-wider uppercase" style={{ fontFamily: "'Comic Neue', cursive" }}>Score</div>
        <div className="text-4xl font-black text-green-800 mt-1 animate-pulse" style={{ fontFamily: "'Press Start 2P', cursive" }}>{score}</div>
        <div className="text-2xl font-bold text-purple-700 mt-1" style={{ fontFamily: "'Press Start 2P', cursive" }}>Bonus: {bonusScore}</div>
        <div className="mt-2 text-xl font-bold text-red-600 animate-ping" style={{ fontFamily: "'Comic Neue', cursive" }}>⏱ {timer}s</div>
      </motion.div>

      {/* Round & Clue */}
      <div className="text-center mb-8 px-4">
        <p className="text-xl font-bold text-yellow-200 tracking-wide animate-pulse">Round {currentRound + 1}/{rounds.length}</p>
        <h2 className="text-2xl font-extrabold mt-2 text-yellow-300 drop-shadow-lg" style={{ fontFamily: "'Comic Neue', cursive" }}>{rounds[currentRound]?.clue}</h2>
      </div>

      {/* Answer Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12 mt-10 justify-items-center">
        {rounds[currentRound]?.options?.length > 0 &&
          rounds[currentRound].options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95, rotate: -2 }}
              className={`
                w-36 h-36 bg-yellow-400 flex items-center justify-center rounded-3xl text-lg font-bold cursor-pointer border-4 border-yellow-500 shadow-2xl transition-all
                ${selected === option && option === rounds[currentRound].answer ? "bg-green-400 border-green-600 shadow-green-400/60" : ""}
                ${selected === option && option !== rounds[currentRound].answer ? "bg-red-400 border-red-600 shadow-red-400/60" : ""}
              `}
              onClick={() => handleSelect(option)}
            >
              <span style={{ fontFamily: "'Press Start 2P', cursive" }}>{option}</span>
            </motion.div>
          ))
        }
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          className="text-2xl font-bold mb-8 bg-white/30 backdrop-blur-sm px-8 py-4 rounded-3xl text-center drop-shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          style={{ fontFamily: "'Comic Neue', cursive" }}
        >
          {feedback}
        </motion.div>
      )}

      {/* Back to Levels */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default IntermediateLevel;
