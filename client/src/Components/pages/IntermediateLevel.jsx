import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const IntermediateLevel = () => {
  const navigate = useNavigate();
  const {levelId} = useParams();

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [scoreThreshold, setScoreThreshold] = useState(0);
  //const [levelName, setLevelName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch level info and rounds from backend
  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const levelId = 2;
        const res = await axios.get(`http://localhost:5000/api/levels/rounds/${levelId}`);
        setRounds(res.data.rounds);
        setScoreThreshold(res.data.level?.scoreThreshold ?? 0);
        // setLevelName(res.data.level?.name ?? "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching level data:", err);
      }
    };
    fetchLevelData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (levelComplete || loading) return;
    if (timer === 0) {
      setFeedback("Time's up! ⏰");
      setTimeout(() => nextRound(), 1000);
      return;
    }
    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer, levelComplete, loading]);

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);

    if (option === rounds[currentRound].answer) {
      setScore(prev => prev + 15);
      setFeedback("Correct! +15 🍌");
    } else {
      setFeedback("Wrong! ❌ No points for this round");
    }

    setTimeout(() => nextRound(), 1000);
  };

  const nextRound = () => {
    setSelected(null);
    setFeedback("");
    setTimer(60);
    if (currentRound >= rounds.length - 1) {
      handleIntermediateComplete();
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  const handleIntermediateComplete = async () => {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/levels/save/intermediate",
        { playerId, levelId, roundsScore: score, bonusScore: 0 },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const intermediateTotal = res.data.total ?? 0;

      if (intermediateTotal >= scoreThreshold) {
        setLevelComplete(true);
        // navigate("/level-complete", { state: { score, bonus: 0, unlocked: true } });
        navigate("/level-complete", {
          state: {
            score,
            bonusBananas: 0,
            bonusPoints: 0,
            intermediateTotal,
            unlocked: intermediateTotal >= scoreThreshold,
            level: "intermediate"
          }
        });

      } else {
        const remaining = Math.max(0, scoreThreshold - intermediateTotal);
        navigate(`/bonus?playerId=${playerId}&remaining=${remaining}&roundsScore=${score}`);
      }
    } catch (err) {
      console.error("Error completing intermediate level", err);
      const remaining = Math.max(0, scoreThreshold - score);
      navigate(`/bonus?playerId=${playerId}&remaining=${remaining}&roundsScore=${score}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white text-2xl">Loading level...</div>;
  }

  if (levelComplete) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">Advanced unlocked!</h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-between text-white py-10" style={{ backgroundImage: "url('/Assets/images/Loading.jpg')", backgroundColor: "rgba(0,0,0,0.6)", backgroundBlendMode: "overlay" }}>
      {/* Score & Timer */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 10 }} className="absolute left-6 top-1/3 transform -translate-y-1/2 bg-yellow-200/90 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
        <div className="text-6xl mb-2 animate-bounce">🐵</div>
        <div className="text-2xl font-extrabold text-yellow-800 tracking-wider uppercase">Score</div>
        <div className="text-4xl font-black text-green-800 mt-1 animate-pulse">{score}</div>
        <div className="text-2xl font-bold text-purple-700 mt-1">Rounds</div>
        <div className="mt-2 text-xl font-bold text-red-600 animate-ping">⏱ {timer}s</div>
      </motion.div>

      {/* Round & Clue */}
      <div className="text-center mb-8 px-4">
        <p className="text-xl font-bold text-yellow-200 tracking-wide animate-pulse">Round {currentRound + 1}/{rounds.length}</p>
        <h2 className="text-2xl font-extrabold mt-2 text-yellow-300 drop-shadow-lg">{rounds[currentRound]?.clue}</h2>
      </div>

      {/* Answer Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12 mt-10 justify-items-center">
        {rounds[currentRound]?.options?.map((option, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(option)}
            className={`w-36 h-36 bg-yellow-400 flex items-center justify-center rounded-3xl text-lg font-bold cursor-pointer border-4 border-yellow-500 shadow-2xl transition-all
              ${selected === option && option === rounds[currentRound].answer ? "bg-green-400 border-green-600" : ""}
              ${selected === option && option !== rounds[currentRound].answer ? "bg-red-400 border-red-600" : ""}
            `}>
            <span style={{ fontFamily: "'Press Start 2P', cursive" }}>{option}</span>
          </motion.div>
        ))}
      </div>

      {/* Feedback */}
      {feedback && <motion.div className="text-2xl font-bold mb-8 bg-white/30 backdrop-blur-sm px-8 py-4 rounded-3xl text-center drop-shadow-xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>{feedback}</motion.div>}

      {/* Back to Dashboard */}
      <button onClick={() => navigate("/dashboard")} className="mb-8 bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition">⬅ Back to Dashboard</button>
    </div>
  );
};

export default IntermediateLevel;
























































































































































































































// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const IntermediateLevel = () => {
//   const navigate = useNavigate();
//   const playerId = localStorage.getItem("playerId");

//   const [rounds, setRounds] = useState([]);
//   const [currentRound, setCurrentRound] = useState(0);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60); // default fallback
//   const [roundTime, setRoundTime] = useState(60); // DB value
//   const [loading, setLoading] = useState(true);

//   // Fetch Intermediate rounds + roundTime
//   useEffect(() => {
//     const fetchRounds = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/levels/rounds/2");
//         setRounds(res.data.rounds);
//         setRoundTime(res.data.level.roundTime); // usually 60
//         setTimeLeft(res.data.level.roundTime);
//         setLoading(false);
//       } catch (err) {
//         console.error("Failed to load rounds", err);
//       }
//     };
//     fetchRounds();
//   }, []);

//   // Timer countdown
//   useEffect(() => {
//     if (loading) return;

//     if (timeLeft === 0) {
//       handleNextRound(false); // time over, wrong answer
//       return;
//     }

//     const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [timeLeft, loading]);

//   const handleAnswer = (selected) => {
//     const correct = rounds[currentRound].answer;

//     if (selected === correct) {
//       setScore((s) => s + 10); // 10 points per correct
//     }

//     handleNextRound(selected === correct);
//   };

//   const handleNextRound = () => {
//     // Move to next round
//     if (currentRound + 1 < rounds.length) {
//       setCurrentRound((r) => r + 1);
//       setTimeLeft(roundTime);
//     } else {
//       finishLevel();
//     }
//   };

//   const finishLevel = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/level/2/score", {
//         playerId,
//         roundsScore: score,
//         bonusScore: 0,
//       });

//       const threshold = res.data.threshold; // from backend
//       const total = res.data.intermediateTotal;

//       if (total >= threshold) {
//         // Unlock Advanced
//         navigate("/level-complete", {
//           state: { level: "intermediate", totalScore: total },
//         });
//       } else {
//         // Need bonus game
//         navigate("/bonus-game", {
//           state: {
//             needed: threshold - total, // remaining points
//             currentScore: total,
//             playerId,
//           },
//         });
//       }
//     } catch (err) {
//       console.error("Saving score failed", err);
//     }
//   };

//   if (loading) return <h2>Loading…</h2>;

//   const current = rounds[currentRound];

//   return (
//     <div className="p-6 text-center">
//       <h1 className="text-3xl font-bold mb-4">Intermediate Level</h1>

//       <h2 className="text-xl mb-2">
//         Round {currentRound + 1} / {rounds.length}
//       </h2>

//       <h3 className="text-red-600 text-2xl mb-4">⏳ {timeLeft}s</h3>

//       <motion.div
//         className="bg-white p-6 rounded-xl shadow-md"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <p className="text-lg font-semibold mb-6">{current.clue}</p>

//         <div className="grid grid-cols-2 gap-4">
//           {current.options.map((opt, i) => (
//             <motion.button
//               key={i}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => handleAnswer(opt)}
//               className="p-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
//             >
//               {opt}
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>

//       <h3 className="text-lg mt-6 font-semibold">Score: {score}</h3>
//     </div>
//   );
// };

// export default IntermediateLevel;
