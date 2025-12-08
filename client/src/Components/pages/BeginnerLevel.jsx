import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const BeginnerLevel = () => {
  const navigate = useNavigate();
  
  //State Management
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRounds = async () =>{
      try{
        const levelId = 1;
        const res = await axios.get(`http://localhost:5000/api/levels/rounds/${levelId}`);
        setRounds(res.data.rounds);
        setLoading(false);
      }catch(err){
        console.error("Error fetching rounds:", err);
      }
    };
    fetchRounds();
  }, []);

  //Function to save score to backend
  const saveScore = async () => {
  try {
    //get logged-in playerId assuming localStorage after the user login
    let playerId = parseInt(localStorage.getItem("playerId"),10);
    if (!playerId) throw new Error("Player ID not found");

    await axios.post("http://localhost:5000/api/levels/save/beginner", {
      playerId,
      levelId: 1,
      scoreValue: score,
    });
    console.log("Beginner score saved!");
  } catch (error) {
    console.error("Error saving beginner score:", error);
  }
};


  //Handle selecting an option
  const handleSelect = (option) => {
    if (selected) return;//prevent multiple selects
    setSelected(option);

    const correct = rounds[currentRound].answer;

    if (option === correct) {
      setScore(score + 10);
      setFeedback("Correct! +10 🍌");

      setTimeout(() => nextRound(), 1000);
    } else {
      setFeedback("Try again! ❌");
      setTimeout(() => setFeedback(""), 1000);
    }
  };

  //Move to next round or finish the level
  const nextRound = () => {
    setSelected(null);
    setFeedback("");

    if (currentRound < rounds.length - 1) {
      setCurrentRound(currentRound + 1);
    }else {
      setLevelComplete(true); 
    }
  };

  //show loading screen
  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center text-white text-4xl">
        Loading....
      </div>
    );
  }

  //level complete screen
  if (levelComplete) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: "url('/Assets/images/Loading.jpg')",
          backgroundColor: "rgba(0,0,0,0.5)",
          backgroundBlendMode: "overlay",
        }}
      >
        <motion.h1 className="text-5xl font-bold mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          🎉 Level Complete!
        </motion.h1>
        <motion.p className="text-2xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Your Score: {score} 🍌
        </motion.p>
        {/* <button
          onClick={async () => {
            await saveScore();
            navigate("/intermediate");
          }
          }
           
          className="bg-yellow-400 text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
        >
          Next Level ➜
        </button> */}
        <button
          onClick={async () => {
            await saveScore();
            navigate("/level-complete", {
              state: {
                score,
                bonusBananas: 0,
                bonusPoints: 0,
                intermediateTotal: score,  // for beginner, total = score
                unlocked: true,            // beginner always unlocks intermediate
                level: "beginner"
              }
            });
          }}
          className="bg-yellow-400 text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
        >
          Continue ➜
        </button>

      </div>
    );
  }

  //Game UI
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-between text-white py-10"
      style={{
        backgroundImage: "url('/Assets/images/Loading.jpg')",
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Monkey Score Popup */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="absolute left-6 top-1/3 transform -translate-y-1/2 bg-yellow-200/90 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center"
      >
        <div className="text-6xl mb-2 animate-bounce">🐵</div>
        <div className="text-2xl font-extrabold text-yellow-800 tracking-wider uppercase" style={{ fontFamily: "'Comic Neue', cursive" }}>
          Score
        </div>
        <div className="text-4xl font-black text-green-800 mt-1 animate-pulse" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          {score} 🍌
        </div>
      </motion.div>

      {/* Top bar */}
      <div className="w-full flex justify-end items-center px-8 mb-12">
        <div className="text-2xl font-semibold">👤 Player</div>
      </div>

      {/* Round & clue */}
      <div className="text-center mb-8 px-4">
        <p className="text-xl font-bold text-yellow-200 tracking-wide animate-pulse">Round {currentRound + 1}/5</p>
        <h2 className="text-2xl font-extrabold mt-2 text-yellow-300 drop-shadow-lg" style={{ fontFamily: "'Comic Neue', cursive" }}>
          {rounds[currentRound].clue}
        </h2>
      </div>

      {/* Answer Cards */}
      <div className="grid grid-cols-4 gap-8 mb-12 mt-10 justify-items-center">
        {rounds[currentRound].options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95, rotate: -2 }}
            className={`
              w-44 h-44 bg-yellow-400 flex items-center justify-center rounded-3xl text-xl font-bold cursor-pointer border-4 border-yellow-500 shadow-2xl transition-all
              ${selected === option && option === rounds[currentRound].answer ? "bg-green-400 border-green-600 shadow-green-400/60" : ""}
              ${selected === option && option !== rounds[currentRound].answer ? "bg-red-400 border-red-600 shadow-red-400/60" : ""}
            `}
            onClick={() => handleSelect(option)}
          >
            <span style={{ fontFamily: "'Press Start 2P', cursive" }}>{option}</span>
          </motion.div>
        ))}
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

      {/* Levels button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default BeginnerLevel;







