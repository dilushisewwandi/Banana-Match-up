import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const [rounds, setRounds] = useState([
    { clue: "A fruit known as the king of fruits in Asia", options: ["Mango", "Durian", "Papaya", "Lychee", "Banana", "Jackfruit"], answer: "Durian" },
    { clue: "A fruit high in vitamin C, often green or purple", options: ["Grapes", "Kiwi", "Orange", "Guava", "Lime", "Starfruit"], answer: "Kiwi" },
    { clue: "A tropical fruit with spiky skin and sweet yellow flesh", options: ["Pineapple", "Mango", "Jackfruit", "Papaya", "Lychee", "Banana"], answer: "Pineapple" },
    { clue: "Small red berries, often used in pies and jams", options: ["Strawberry", "Raspberry", "Cranberry", "Cherry", "Gooseberry", "Lingonberry"], answer: "Raspberry" },
    { clue: "A fruit often confused with vegetables, purple outside, green inside", options: ["Eggplant", "Plum", "Passionfruit", "Avocado", "Figs", "Okra"], answer: "Passionfruit" },
    { clue: "A yellow tropical fruit that's curved and sweet", options: ["Banana", "Plantain", "Mango", "Papaya", "Pineapple", "Durian"], answer: "Banana" },
  ]);

  // Timer logic
  useEffect(() => {
    if (levelComplete) return;

    if (timer === 0) {
      setFeedback("Time's up! ⏰ ");
      fetchBonusChallenge();
      return;
    }

    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer, levelComplete]);

  // Fetch bonus challenge from backend
  const fetchBonusChallenge = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bonus/challenge");
      const newChallenge = response.data;

      const updatedRounds = [...rounds];
      updatedRounds[currentRound] = {
        clue: newChallenge.question || "Bonus question",
        options: Array.isArray(newChallenge.options) ? newChallenge.options : [],
        answer: newChallenge.answer || ""
      };

      setRounds(updatedRounds);
      setSelected(null);
      setFeedback("New Bonus Challenge! 🔢");
      setTimer(60);

    } catch (error) {
      console.error("Error fetching bonus challenge:", error);
      nextRound();
    }
  };

  // Submit bonus score
  const submitBonusScore = async (points) => {
    try{
      const playerId = localStorage.getItem("playerId");
      await axios.post("http://localhost:5000/api/bonus/submit", {
        playerId,
        level: "Intermediate",
        bonusPoints: points,
      })
      console.log("Bonus points submitted!");
    }catch (error){
      console.error("Error submitting bonus score:", error);
    }
  };

  // Handle answer selection
  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);

    if (option === rounds[currentRound].answer) {
      const points = feedback.includes("Bonus") ? 20 : 15; 
      if (feedback.includes("Bonus")){
        setBonusScore(prev => prev + points);
        submitBonusScore(points);
      } else setScore(prev => prev + points);

      setFeedback(`Correct! +${points} 🍌`);
      setTimeout(() => nextRound(), 1000);
    } else {
      setFeedback("Wrong! ❌ Bonus triggered!");
      setTimeout(() => fetchBonusChallenge(), 1000);
    }
  };

  // Move to next round
  const nextRound = () => {
    setSelected(null);
    setFeedback("");
    setTimer(60);
    if (currentRound >= rounds.length - 1) {
      setLevelComplete(true);
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  // Save total score (regular + bonus) to backend
  const saveScore = async () => {
    try {
      const playerId = localStorage.getItem("playerId");
      await axios.post("http://localhost:5000/api/level/intermediate", {
        playerId,
        scoreValue: score + bonusScore,
      });
      console.log("Intermediate score with bonus saved!");
    } catch (error) {
      console.error("Error saving intermediate score:", error);
    }
  };

  // Save score only once when level completes
  useEffect(() => {
    if (levelComplete) saveScore();
  }, [levelComplete]);

  // Level complete screen
  if (levelComplete) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: "url('/Assets/images/Loading.jpg')", backgroundColor: "rgba(0,0,0,0.5)", backgroundBlendMode: "overlay" }}
      >
        <motion.h1 className="text-5xl font-bold mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          🎉 Intermediate Level Complete!
        </motion.h1>
        <motion.p className="text-2xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Your Score: {score} 🍌 + Bonus: {bonusScore} 🔢
        </motion.p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-yellow-400 text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Back to Dashboard ⬅
        </button>
      </div>
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
