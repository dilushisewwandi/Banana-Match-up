import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdvancedLevel = () => {
  const navigate = useNavigate();

  //State management
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);
  const [timer, setTimer] = useState(30);

  //Game rounds
  const rounds = [
    {
      clue: "A rare fruit with a spiky exterior and creamy flesh, known for its strong odor",
      options: ["Mango", "Durian", "Papaya", "Lychee", "Banana", "Jackfruit", "Rambutan", "Mangosteen"],
      answer: "Durian",
    },
    {
      clue: "A small brown fruit with fuzzy skin and bright green inside, rich in vitamin C",
      options: ["Kiwi", "Grapes", "Guava", "Fig", "Starfruit", "Dragonfruit", "Longan", "Clementine"],
      answer: "Kiwi",
    },
    {
      clue: "A tropical fruit with spiky skin and sweet yellow flesh often used in upside-down cakes",
      options: ["Pineapple", "Mango", "Papaya", "Jackfruit", "Rambutan", "Guava", "Passionfruit", "Lychee"],
      answer: "Pineapple",
    },
    {
      clue: "Tiny red berries used in jams and desserts, growing on prickly bushes",
      options: ["Raspberry", "Strawberry", "Cranberry", "Cherry", "Gooseberry", "Lingonberry", "Blackberry", "Mulberry"],
      answer: "Raspberry",
    },
    {
      clue: "A tropical fruit with wrinkly purple skin and jelly-like seeds inside",
      options: ["Passionfruit", "Plum", "Figs", "Avocado", "Dragonfruit", "Tamarind", "Lychee", "Kumquat"],
      answer: "Passionfruit",
    },
    {
      clue: "A bright orange fruit often mistaken for a vegetable, used in both sweet and savory dishes",
      options: ["Pumpkin", "Persimmon", "Carrot", "Mango", "Papaya", "Orange", "Cantaloupe", "Apricot"],
      answer: "Persimmon",
    },
    {
      clue: "A fruit with rough skin that reveals juicy red seeds inside, symbolizing prosperity",
      options: ["Pomegranate", "Apple", "Cherry", "Strawberry", "Cranberry", "Dragonfruit", "Plum", "Mulberry"],
      answer: "Pomegranate",
    },
    {
      clue: "A green fruit that’s creamy inside, often used for guacamole",
      options: ["Avocado", "Kiwi", "Cucumber", "Papaya", "Melon", "Guava", "Passionfruit", "Lime"],
      answer: "Avocado",
    },
    
  ];

  //Timer logic
  useEffect(() => {
    if (levelComplete) return;

    if(timer === 0){
      setFeedback("Time's up! ⏰");
      setTimeout(() => nextRound(), 1000);
      return;
    }

    const countdown = setInterval(()=> setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer, levelComplete]);

  //Handle answer select
  const handleSelect = (Option) => {
    if (selected) return; //prevent multiple clicks
    setSelected(Option);

    if(Option === rounds[currentRound].answer){
      setScore(score +15);
      setFeedback("Correct! +15 🍌");
      setTimeout(() => nextRound(), 1000);
    }else{
      setFeedback("Wrong! ❌");
      setTimeout(() => setFeedback(""), 1000);
    }
  };

  //Move to the next round
  const nextRound = () => {
    setSelected(null);
    setFeedback("");
    setTimer(30);

    if(currentRound < rounds.length - 1)
      setCurrentRound(currentRound + 1);
    else
      setLevelComplete(true);
  };

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
          🎉 Advanced Level Complete!
        </motion.h1>
        <motion.p className="text-2xl mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Your Score: {score} 🍌
        </motion.p>
        <button
          onClick={() => navigate("/levels")}
          className="bg-yellow-400 text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition" style={{fontFamily: "'Press Start 2P', cursive"}}
        >
           ⬅Back to Levels
        </button>
      </div>
    );
  }

  //Game UI
  return(
    <div className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-between text-white py-10"
      style={{
        backgroundImage: "url('/Assets/images/Loading.jpg')",
        backgroundColor:"rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 10 }}
      className = "absolute left-6 top-1/3 transform -translate-y-1/2 bg-yellow-200/90 backdrop-blur-sm px-6 py-4 rounded-3xl shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
      <div className="text-6xl mb-2 animate-bounce">🐵</div>
      <div className="text-2xl font-extrabold text-yellow-800 tracking-wider uppercase"
        style={{fontFamily: "'Comic Neue', cursive"}}
      >
        Score
      </div>
      <div className="text-4xl font-black text-green-800 mt-1 animate-pulse" 
        style={{fontFamily: "'Press Start 2P', cursive"}}
      >{score}
      </div>
      <div className="mt-2 text-xl font-bold text-red-600 animate-ping">
        ⏱{timer}
      </div>
    </motion.div>

    <div className="w-full flex justify-end items-center px-8 mb-12">
      <div className="text-2xl font-bold" style={{fontFamily: "'Press Start 2P', cursive"}}>
        👤 Player
      </div>
    </div>

    <div className="text-center mb-8 px-4">
      <p className="text-xl font-bold text-yellow-200 tracking-wide animate-pulse">Round {currentRound+1}/8</p>
      <h2 className="text-2xl font-extrabold mt-2 text-yellow-300 drop-shadow-lg" 
      style={{fontFamily: "'Comic Neue', cursive"}}>{rounds[currentRound].clue}</h2>
    </div>

    <div className="grid grid-cols-4 gap-6 mb-12 mt-10 justify-items-center">
      {rounds[currentRound].options.map((option, index) =>(
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
      ))}
    </div>

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

    <button className="mb-2 bg-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition" style={{fontFamily: "'Press Start 2P', cursive"}}
      onClick={() => navigate("/levels")}> ⬅Back to Levels</button>
  </div>
  );
};

export default AdvancedLevel;