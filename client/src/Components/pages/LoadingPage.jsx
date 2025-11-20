// This component was partially generated using an AI tool (ChatGPT).
// Tailwind CSS classes were adapted from official documentation: https://tailwindcss.com/docs

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

//Loading page component
const LoadingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => navigate("/auth"), 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);


  //Loading screen interface
  return (
    <AnimatePresence>{/*for smooth exit transitions*/}
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-lime-100 via-green-100 to-yellow-100 font-playful overflow-hidden z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Corner Monkeys */}
          <motion.img
            src="/Assets/images/cartoon-monkey.png"
            alt="monkey"
            className="absolute top-4 left-4 w-24 md:w-32"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.img
            src="/Assets/images/cartoon-monkey.png"
            alt="monkey"
            className="absolute bottom-4 right-4 w-24 md:w-32"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />

          {/* Top-right Banana */}
          <motion.img
            src="/Assets/images/Banana.png"
            alt="banana"
            className="absolute top-6 right-6 w-24 md:w-32"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />

          {/* Bottom-left Banana */}
          <motion.img
            src="/Assets/images/Banana.png"
            alt="banana"
            className="absolute bottom-6 left-6 w-24 md:w-32"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />

          {/* Center Content */}
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-lime-700 mb-10 animate-pulse"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            🍌 Banana Match-Up 🍌
          </motion.h1>

          {/*Center Banana images*/}
          <div className="flex space-x-10">
            <motion.img
              src="/Assets/images/Banana.png"
              alt="banana"
              className="w-28 md:w-36"
              animate={{ y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <motion.img
              src="/Assets/images/Banana.png"
              alt="banana"
              className="w-32 md:w-40"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <motion.img
              src="/Assets/images/Banana.png"
              alt="banana"
              className="w-28 md:w-36"
              animate={{ y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
            />
          </div>
          
          {/*Loading text*/}
          <motion.p
            className="mt-8 text-2xl md:text-3xl text-green-700 font-semibold"
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Peeling bananas... 🍌
          </motion.p>

          {/* Progress Dots */}
          <div className="flex space-x-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-5 bg-yellow-400 rounded-full"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;
