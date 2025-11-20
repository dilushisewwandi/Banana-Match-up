import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState({ name: "Player" });

  useEffect(() =>{
    //Get the JWT token stored in localStorage after login
    const token = localStorage.getItem("token");

    //If there is no token, redirect the user to the login page
    if(!token) {
      navigate("/login"); 
      return;
    }

     // Fetch logged-in user's info from backend
    fetch("http://localhost:5000/api/user", 
      {headers: {"Authorization": `Bearer ${token}`, // send JWT token in header for authentication
    },})
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      if (data.user){
        // Update the state with the fetched username
        setPlayer({name: data.user.username});
      }
    })
    .catch(err => console.error(err)); 
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-lime-100 via-green-100 to-yellow-100 overflow-hidden font-playful">
      {/* Animated Background Bananas */}
      <img
        src="/Assets/images/Banana.png"
        alt="banana"
        className="absolute w-64 md:w-80 top-10 left-16 opacity-25 animate-bounce"
      />
      <img
        src="/Assets/images/Banana.png"
        alt="banana"
        className="absolute w-72 md:w-96 bottom-20 right-20 opacity-30 animate-spin-slow"
      />

      {/* Main Welcome Section */}
      <div className="z-10 text-center space-y-6 px-4 drop-shadow-xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-lime-700 animate-bounce">
          🍌 Welcome, {player.name}! 🍌
        </h1>

        <p className="text-2xl md:text-3xl text-green-700 font-semibold animate-pulse">
          Ready to flex your fruit-fueled brain power?
        </p>

        <h2
          className="mt-8 text-5xl md:text-6xl font-extrabold text-yellow-600 hover:text-yellow-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 hover:rotate-2 drop-shadow-lg"
        onClick={() => navigate("/dashboard")}>
          ✨ Tap to Play ✨
        </h2>
      </div>
    </div>
  );
};

export default WelcomePage;
