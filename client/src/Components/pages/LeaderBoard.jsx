import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const myUserId = localStorage.getItem("userId");

  //fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaderboard");
      setPlayers(res.data.leaderboard || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);


  //search players
  const filteredPlayers = players.filter((p) =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  //leaderboard UI
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-yellow-50">

      {/* Banana Rain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{ y: window.innerHeight + 100 }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            🍌
          </motion.div>
        ))}
      </div>

      <h1 className="text-5xl font-black text-yellow-600 drop-shadow-lg mb-4 z-10">
        🏆 Leaderboard 🏆
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search player..."
        className="z-10 mb-3 px-4 py-2 border rounded-lg outline-none shadow-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Last Updated */}
      <p className="z-10 text-sm text-gray-500 mb-4">
        Last updated: {lastUpdated}
      </p>

      {loading ? (
        <p className="z-10 text-xl">Loading...</p>
      ) : (
        <div className="w-full max-w-xl z-10 space-y-2">
          {filteredPlayers.map((p, i) => {
            const isMe = String(p.userId) === String(myUserId);

            return (
              <motion.div
                key={p.playerId}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`
                  flex justify-between items-center px-4 py-2 rounded-lg shadow-md border-2
                  ${isMe ? "bg-green-200 border-green-400" :
                    i === 0 ? "bg-yellow-400 border-yellow-500" :
                    i === 1 ? "bg-gray-300 border-gray-400" :
                    i === 2 ? "bg-orange-300 border-orange-400" :
                    "bg-white border-yellow-200"}
                `}
              >
                {/* Rank / Medal */}
                <div className="text-lg font-extrabold w-12">
                  {i === 0 ? "🥇" :
                   i === 1 ? "🥈" :
                   i === 2 ? "🥉" :
                   `#${i + 1}`}
                </div>

                {/* Username */}
                <div className="text-base font-bold text-gray-800 flex-1 text-center">
                  {p.username}
                  {isMe && " (You)"}
                </div>

                {/* Score */}
                <div className="text-base font-black text-green-700">
                  {p.totalScore} 🍌
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-8 z-10 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
      >
        ⬅ Back to Dashboard
      </button>

    </div>
  );
};

export default Leaderboard;
