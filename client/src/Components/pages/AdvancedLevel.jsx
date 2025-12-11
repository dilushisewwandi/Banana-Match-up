import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AdvancedLevel = () => {
  const navigate = useNavigate();
  const {levelId} = useParams();

  //state manage
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [allCorrect, setAllCorrect] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(30);
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

  //fetch rounds
  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const token = localStorage.getItem("token");
        const effectiveLevelId = Number(levelId) || 3; //fix by github copilot
        const res = await axios.get(`http://localhost:5000/api/levels/rounds/${effectiveLevelId}`, //fix by github copilot
          {headers: {Authorization: `Bearer ${token}`}}
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

  //timer handle for rounds
  useEffect(() => {
    if (gameComplete || loading) return;

    if (timer === 0) {
      setFeedback("⏰ Time's up!");
      setTimeout(() => {
        if (currentRound >= rounds.length - 1) {
          handleAdvancedComplete();
        } else {
          nextRound();
        }
      }, 800);
      return;
    }

    const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer, gameComplete, loading, currentRound, rounds.length]);

  //handle select answer
  const handleSelect = (option) => {
    if (selected) return;  //double click prevent
    setSelected(option);

    const isCorrect = option === rounds[currentRound]?.answer;
    const newScore = isCorrect ? score + 20 : score;

    if (!isCorrect) setAllCorrect(false);
    setScore(newScore);
    setFeedback(isCorrect ? "✅ Correct! +20 🍌" : "Wrong! ❌ No points for this round");

    //fix by github copilot
    setTimeout(() => {
      if (currentRound >= rounds.length - 1) {
        // final round: if all answered correctly, finalize and save; otherwise go to bonus
        if (allCorrect && isCorrect) {
          handleAdvancedComplete(newScore);
        } else {
          // navigate to bonus game when not all correct
          const playerId = localStorage.getItem("playerId");
          const remaining = Math.max(0, scoreThreshold - newScore);
          navigate(`/bonus?playerId=${playerId}&remaining=${remaining}&roundsScore=${newScore}&level=advanced`);
        }
      } else {
        nextRound();
      }
    }, 900);
  };

  //move to next round
  const nextRound = () => {
    setSelected(null);
    setFeedback("");
    setTimer(30);

    if (currentRound < rounds.length - 1) {
      setCurrentRound(prev => prev + 1);
    }
  };

  //save advanced level score 
  const handleAdvancedComplete = async (finalRunScore) => {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const roundsScoreToSend = typeof finalRunScore === 'number' ? finalRunScore : score;

      if (!token){
        navigate("/login");
        return;
      }
      //send level score to the backend
      const res = await axios.post(
        "http://localhost:5000/api/levels/save/advanced",
        { levelId, roundsScore: roundsScoreToSend, bonusScore: 0 },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      //fix by github copilot
      // use server response as source-of-truth; fallback to roundsScoreToSend
      const advancedTotal = res.data?.playerTotal ?? 
                            res.data?.advancedTotal ?? 
                            res.data?.total ?? 
                            roundsScoreToSend;


      if (advancedTotal >= scoreThreshold) {
        setGameComplete(true);
        navigate("/win", {
          state: {
            score: roundsScoreToSend,
            bonusBananas: 0,
            bonusPoints: 0,
            advancedTotal,
            win: true,
            level: "advanced"
          }
        });
      } else {
        const remaining = Math.max(0, scoreThreshold - advancedTotal);
        navigate(`/bonus?playerId=${playerId}&remaining=${remaining}&roundsScore=${roundsScoreToSend}&level=advanced`);
      }
    } catch (err) {
      console.error("Error completing advanced level", err);
      const roundsScoreToSend = typeof finalRunScore === 'number' ? finalRunScore : score;
      const remaining = Math.max(0, scoreThreshold - roundsScoreToSend);
      navigate(`/bonus?playerId=${playerId}&remaining=${remaining}&roundsScore=${roundsScoreToSend}&level=advanced`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white text-2xl">Loading level...</div>;
  }

  if(gameComplete){
    return(
      <div className="p-8">
        <h2 className="test-2xl font-bold">Game win!</h2>
      </div>
    );
  }

  //advanced level UI
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-between text-white py-10"
      style={{
        backgroundImage: "url('/Assets/images/Loading.jpg')",
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <motion.div className="absolute left-6 top-1/3 bg-yellow-200/90 px-6 py-4 rounded-3xl border-4 border-yellow-400 flex flex-col items-center">
        <div className="text-6xl">🐵</div>
        <div className="text-2xl text-yellow-800 font-bold" style={{ fontFamily: "'Comic Neue', cursive" }}>Score</div>
        <div className="text-4xl text-green-800 font-black" style={{ fontFamily: "'Press Start 2P', cursive" }}>{score} 🍌</div>
        <div className="mt-2 text-xl text-red-600 animate-ping">⏱ {timer}s</div>
      </motion.div>

      <div className="text-center mt-20">
        <p className="text-xl font-bold text-yellow-200 tracking-wide animate-pulse">
          Round {currentRound + 1}/{rounds.length}
        </p>
        <h2 className="text-2xl font-bold text-yellow-300 mt-2" style={{ fontFamily: "'Comic Neue', cursive" }}>
          {rounds[currentRound]?.clue}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-10">
        {rounds[currentRound]?.options?.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-36 h-36 bg-yellow-400 flex items-center justify-center rounded-3xl font-bold text-lg cursor-pointer border-4
              ${selected === option && option === rounds[currentRound].answer ? "bg-green-400 border-green-700" : ""}
              ${selected === option && option !== rounds[currentRound].answer ? "bg-red-400 border-red-700" : ""}
            `}
            onClick={() => handleSelect(option)}
          >
            <span style={{ fontFamily: "'Press Start 2P', cursive" }}>{option}</span>
          </motion.div>
        ))}
      </div>

      {feedback && (
        <div className="text-2xl font-bold bg-white/30 px-6 py-3 rounded-3xl mt-4">
          {feedback}
        </div>
      )}

      <button
        onClick={() => navigate("/levels")}
        className="mb-6 bg-green-600 px-6 py-3 rounded-xl font-bold"
      >
        ⬅ Back to Levels
      </button>
    </div>
  );
};

export default AdvancedLevel;
