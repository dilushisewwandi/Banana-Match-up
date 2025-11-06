// // This component was partially generated using an AI tool (ChatGPT).
// // Tailwind CSS classes were adapted from official documentation: https://tailwindcss.com/docs
import React, { useState } from "react";
import SignupForm from "../forms/SignupForm";
import LoginForm from "../forms/LoginForm";
import { motion, AnimatePresence } from "framer-motion";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col md:flex-row items-center justify-between px-6 md:px-20 overflow-hidden"
      style={{ backgroundImage: "url('/Assets/images/jungle-bg.jpg')" }}
    >
      <AnimatePresence mode="wait">
        {isSignup ? (
          <motion.div
            key="signup"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignupForm onSignupSuccess={() => setIsSignup(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoginForm />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center md:text-left md:w-1/2 text-white space-y-6">
        <h1 className="text-3xl md:text-5xl font-playful drop-shadow-lg animate-pulse">
          🍌 Banana Match-Up 🍌
        </h1>

        <p className="text-lg md:text-2xl font-playful drop-shadow-md max-w-md mx-auto md:mx-0 animate-fadeIn">
          Train your brain — match words, solve puzzles, and feed the monkey!
        </p>

        <div className="flex justify-center md:justify-start space-x-4 mt-6">
          <img src="/Assets/images/Banana.png" alt="banana" className="w-12 md:w-16 animate-bounce" />
          <img src="/Assets/images/Banana.png" alt="banana" className="w-10 md:w-14 animate-spin" />
          <img src="/Assets/images/Banana.png" alt="banana" className="w-12 md:w-16 animate-bounce" />
        </div>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="mt-6 px-4 py-2 bg-yellow-400 text-green-800 font-bold rounded hover:bg-yellow-300 transition-all"
        >
          {isSignup ? "Already have an account? Login here" : "New to the jungle? Signup here"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
