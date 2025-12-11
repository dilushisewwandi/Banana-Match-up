import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const IntermediateLevel = () => {
  const navigate = useNavigate();
  const {levelId} = useParams();

  //state management
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [scoreThreshold, setScoreThreshold] = useState(0);
  const [loading, setLoading] = useState(true);

  //redirect login when no token
    useEffect(() => {
      const token = localStorage.getItem("token");
      if(!token){
        navigate("/auth");
      }
    }, []);

  //fetch levels
  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const effectiveLevelId = Number(levelId) || 2; // fallback to level 2 when param missing(fix by github copilot)

        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/levels/rounds/${effectiveLevelId}`,
          {headers: token ? {Authorization: `Bearer ${token}`} : {}}
        );

        setRounds(res.data.rounds || []);
        setScoreThreshold(res.data.level?.scoreThreshold ?? 0);
      } catch (err) {
        console.error("Error fetching level data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLevelData();
  }, [levelId]);
  

  //timer 
  useEffect(() => {
    if (levelComplete || loading) return;
    if (timer === 0) {
      setFeedback("Time's up! ⏰");
      setTimeout(() => {
        // fix by github copilot: if final round, complete with current score (no extra points on timeout)
        if (currentRound >= rounds.length - 1) {
          handleIntermediateComplete(score);
        } else {
          nextRound();
        }
      }, 1000);
      return;
    }
    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer, levelComplete, loading, currentRound, rounds.length, score]);


  //handle select answer
  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);

    const isCorrect = option === rounds[currentRound]?.answer;
    const newScore = isCorrect ? score + 15 : score;

    //below part fix by github copilot
    // apply local score immediately and show feedback
    setScore(newScore);
    setFeedback(isCorrect ? "Correct! +15 🍌" : "Wrong! ❌ No points for this round");

    // after a short delay, either move to next round or finalize using the computed newScore
    setTimeout(() => {
      if (currentRound >= rounds.length - 1) {
        // final round answered — pass final run score to completion handler to avoid state race
        handleIntermediateComplete(newScore);
      } else {
        nextRound();
      }
    }, 1000);
  };

  //move to next round
  const nextRound = () => {
    setSelected(null);
    setFeedback("");
    setTimer(60);
    if (currentRound < rounds.length - 1) {
      setCurrentRound(prev => prev + 1);
    }
  };

  //save intermediate level score and unlock advanced level
  const handleIntermediateComplete = async (finalRunScore) => {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const roundsScoreToSend = typeof finalRunScore === 'number' ? finalRunScore : score;

      const res = await axios.post(
        "http://localhost:5000/api/levels/save/intermediate",
        {roundsScore: roundsScoreToSend, bonusScore: 0 },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      // fix by github copilot: prefer server-provided total as source-of-truth
      const intermediateTotal = res.data?.intermediateTotal ?? res.data?.playerTotal ?? roundsScoreToSend;

      //unlock advanced level
      if (intermediateTotal >= scoreThreshold) {
        setLevelComplete(true);
        navigate("/level-complete", {
          state: {
            score: roundsScoreToSend,
            bonusBananas: 0,
            bonusPoints: 0,
            intermediateTotal,
            unlocked: true,
            level: "intermediate"
          }
        });
      } else {
        //go to banana game
        const remaining = Math.max(0, scoreThreshold - intermediateTotal);
        navigate(`/bonus?playerId=${playerId}&remaining=${remaining}&roundsScore=${roundsScoreToSend}&level=intermediate`);
      }
    } catch (err) {
      console.error("Error completing intermediate level", err);
      const roundsScoreToSend = typeof finalRunScore === 'number' ? finalRunScore : score;
      const remaining = Math.max(0, scoreThreshold - roundsScoreToSend);
      navigate(`/bonus?playerId=${playerId}&remaining=${remaining}&roundsScore=${roundsScoreToSend}&level=intermediate`);
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


//intermediate level UI
  return (
    <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-between text-white py-10" style={{ backgroundImage: "url('/Assets/images/Loading.jpg')", backgroundColor: "rgba(0,0,0,0.6)", backgroundBlendMode: "overlay" }}>
      {/* Score & Timer */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 10 }} className="absolute left-6 top-1/3 transform -translate-y-1/2 bg-yellow-200/90 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
        <div className="text-6xl mb-2 animate-bounce">🐵</div>
        <div className="text-2xl font-extrabold text-yellow-800 tracking-wider uppercase" style={{ fontFamily: "'Comic Neue', cursive" }}>Score</div>
        <div className="text-4xl font-black text-green-800 mt-1 animate-pulse" style={{ fontFamily: "'Press Start 2P', cursive" }}>{score}</div>
        <div className="text-2xl font-bold text-purple-700 mt-1">Rounds</div>
        <div className="mt-2 text-xl font-bold text-red-600 animate-ping">⏱ {timer}s</div>
      </motion.div>

      {/* Round & Clue */}
      <div className="text-center mb-8 px-4">
        <p className="text-xl font-bold text-yellow-200 tracking-wide animate-pulse">Round {currentRound + 1}/{rounds.length}</p>
        <h2 className="text-2xl font-extrabold mt-2 text-yellow-300 drop-shadow-lg" style={{ fontFamily: "'Comic Neue', cursive" }}>{rounds[currentRound]?.clue}</h2>
      </div>

      {/* Answer Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12 mt-10 justify-items-center">
        {rounds[currentRound]?.options?.map((option, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(option)}
            className={`w-36 h-36 bg-yellow-400 flex items-center justify-center rounded-3xl text-lg font-bold cursor-pointer border-4 border-white shadow-2xl transition-all
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