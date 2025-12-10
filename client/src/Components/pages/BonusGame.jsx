import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const BonusGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const playerId = searchParams.get("playerId") || localStorage.getItem("playerId");
  const roundsScore = Number(searchParams.get("roundsScore") ?? 0);
  const level = searchParams.get("level") || "intermediate";

  const [scoreThreshold, setScoreThreshold] = useState(0);
  const [bananaToPoints, setBananaToPoints] = useState(10);

  const [gameId, setGameId] = useState(null);
  const [imageData, setImageData] = useState("");
  const [answer, setAnswer] = useState("");
  const [lastRoundBananas, setLastRoundBananas] = useState(0);
  const [totalBananas, setTotalBananas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [savingFinal, setSavingFinal] = useState(false);

  // ✅ Correct logic: Every 5 bananas = bananaToPoints
  const bonusPoints = useMemo(
    () => Math.floor(totalBananas / 5) * bananaToPoints,
    [totalBananas, bananaToPoints]
  );

  const remainingPoints = useMemo(() => {
    return Math.max(0, scoreThreshold - roundsScore - bonusPoints);
  }, [scoreThreshold, roundsScore, bonusPoints]);

  // ✅ Load level config
  useEffect(() => {
    const fetchLevelConfig = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/levels/config/${level}`);
        setScoreThreshold(res.data.scoreThreshold);
        setBananaToPoints(res.data.bananaToPoints);
      } catch (err) {
        console.error("Failed to load level config");
      }
    };

    fetchLevelConfig();
  }, [level]);



useEffect(() => {
  console.log("LEVEL CONFIG:", {
    scoreThreshold,
    bananaToPoints
  });
}, [scoreThreshold, bananaToPoints]);





  // ✅ Load puzzle
  useEffect(() => {
    const fetchPuzzle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/banana/new?playerId=${playerId}`
        );
        setGameId(res.data.gameId);
        setImageData(res.data.imageData);
      } catch (err) {
        setFeedback("Failed to load puzzle.");
      } finally {
        setLoading(false);
      }
    };

    if (playerId) fetchPuzzle();
  }, [playerId]);

  const fetchPuzzle = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/banana/new?playerId=${playerId}`
      );
      setGameId(res.data.gameId);
      setImageData(res.data.imageData);
    } catch (err) {
      setFeedback("Failed to load puzzle.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer) {
      setFeedback("Enter an answer.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/banana/submit", {
        gameId,
        answer,
      });

      const earned = Number(res.data.bananasEarned || 0);
      const newTotalBananas = totalBananas + earned;

      setLastRoundBananas(earned);
      setTotalBananas(newTotalBananas);

      setFeedback(res.data.correct ? `✅ +${earned} 🍌` : "❌ Wrong!");

      const newBonusPoints =
        Math.floor(newTotalBananas / 5) * bananaToPoints;

      const newRemaining = Math.max(
        0,
        scoreThreshold - roundsScore - newBonusPoints
      );

      setAnswer("");

      if (newRemaining <= 0) {
        await finalizeAndComplete(newTotalBananas);
      } else {
        setTimeout(fetchPuzzle, 500);
      }
    } catch {
      setFeedback("Submission failed.");
      setTimeout(fetchPuzzle, 500);
    }
  };

  const finalizeAndComplete = async (finalBananas) => {
    setSavingFinal(true);

    const api =
      level === "advanced"
        ? "http://localhost:5000/api/levels/save/advanced"
        : "http://localhost:5000/api/levels/save/intermediate";

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        api,
        {
          playerId,
          roundsScore,
          bonusScore: finalBananas,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const calculatedBonus =
        Math.floor(finalBananas / 5) * bananaToPoints;

      const total =
        res.data?.advancedTotal ??
        res.data?.intermediateTotal ??
        (roundsScore + calculatedBonus);

      if (level === "advanced") {
        navigate("/win", {
          state: {
            score: roundsScore,
            bonusBananas: finalBananas,
            bonusPoints: calculatedBonus,
            total,
            level: "advanced",
          },
        });
      } else {
        navigate("/level-complete", {
          state: {
            score: roundsScore,
            bonusBananas: finalBananas,
            bonusPoints: calculatedBonus,
            intermediateTotal: total,
            unlocked: total >= scoreThreshold,
            level: "intermediate",
          },
        });
      }
    } catch (err) {
      setFeedback("Failed to save score.");
      setSavingFinal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 overflow-hidden flex flex-col items-center justify-center text-gray-800">

      {/* 🍌 Banana Rain */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: ["-10%", "110%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute text-3xl pointer-events-none"
          style={{ left: `${Math.random() * 100}%` }}
        >
          🍌
        </motion.div>
      ))}

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="relative z-10 w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-yellow-300 p-8 text-center"
      >
        <motion.h1
          className="text-4xl font-extrabold mb-4 text-yellow-600"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          🍌 BONUS GAME 🍌
        </motion.h1>

        {imageData && (
          <img
            src={imageData}
            alt="Banana puzzle"
            className="w-full rounded-lg border-4 border-yellow-400 mb-4 shadow-lg"
          />
        )}

        <input
          type="number"
          placeholder="Enter answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="px-4 py-2 border-2 border-yellow-300 rounded w-64 mb-3 text-center text-lg font-bold"
        />

        <div className="flex gap-3 mb-4 justify-center">
          <button
            onClick={submitAnswer}
            disabled={savingFinal}
            className="px-4 py-2 bg-yellow-400 rounded shadow hover:bg-yellow-500 font-bold"
          >
            Submit
          </button>

          <button
            onClick={fetchPuzzle}
            className="px-4 py-2 bg-gray-200 rounded shadow hover:bg-gray-300 font-bold"
          >
            Skip
          </button>
        </div>

        {feedback && (
          <motion.div
            className="mb-3 text-lg font-bold text-green-700"
            animate={{ scale: [1, 1.05, 1] }}
          >
            {feedback}
          </motion.div>
        )}

        <div className="mt-4 text-center space-y-1 text-lg font-bold">
          <div>
            Last round bananas:{" "}
            <span className="text-yellow-500">{lastRoundBananas}</span>
          </div>
          <div>
            Total bananas:{" "}
            <span className="text-yellow-500">{totalBananas}</span>
          </div>
          <div>
            Bonus points:{" "}
            <span className="text-yellow-500">{bonusPoints}</span>
          </div>

          <div className="mt-2">
            Remaining to unlock: <strong>{remainingPoints}</strong> points
          </div>
        </div>

        {savingFinal && (
          <div className="mt-3 text-lg font-bold text-blue-600">
            Saving final score...
          </div>
        )}
      </motion.div>
    </div>
  );

};

export default BonusGame;
