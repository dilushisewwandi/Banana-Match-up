import React from "react";

const BonusGame = ({ playerId, onComplete }) => {
  const finish = () => {
    onComplete(20);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/Assets/images/bg2.jpg')", backgroundColor: "rgba(0,0,0,0.6)", backgroundBlendMode: "overlay" }}
    >
      <h1 className="text-4xl font-bold mb-4">🍌 Banana Math Challenge 🍌</h1>
      <p className="mb-6">Let's Play this mini-game to claim bonus points.</p>

      <div className="shadow-2xl rounded-xl overflow-hidden border-4 border-yellow-400 bg-black">
        <iframe
          src="https://marcconrad.com/uob/banana/"
          width={1024}
          height={600}
          title="Banana Math Game"
          className="rounded-xl"
          style={{ display: "block" }}
        />
      </div>

      <button
        onClick={finish}
        className="mt-6 px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Finish & Claim 20 Bonus Points
      </button>

      <button
        onClick={() => onComplete(0)} 
        className="mt-4 px-6 py-2 bg-transparent border border-white text-white rounded"
      >
        Finish without Bonus
      </button>
    </div>
  );
};

export default BonusGame;
