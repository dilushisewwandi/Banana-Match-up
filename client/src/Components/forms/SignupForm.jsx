// // This component was partially generated using an AI tool (ChatGPT).
// // Tailwind CSS classes were adapted from official documentation: https://tailwindcss.com/docs
import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🍌 Signup Successful! Welcome to the Jungle! 🌴", {
          style: {
            background: "#E9FFE7",
            color: "#256029",
            border: "2px solid #B5E48C",
            borderRadius: "12px",
            fontFamily: "Comic Sans MS, sans-serif",
          },
          icon: "🎉",
        });

        setTimeout(() => {
          onSignupSuccess(); // Switch to Login form smoothly
        }, 1500);
      } else {
        toast.error(`⚠️ ${data.message || "Signup failed!"}`, {
          style: {
            background: "#FFF1E1",
            color: "#B85C00",
            border: "2px solid #FEC260",
            borderRadius: "12px",
          },
        });
      }
    } catch (error) {
      toast.error("🚨 Server not responding!", {
        style: {
          background: "#FFEAEA",
          color: "#A50E0E",
          border: "2px solid #FF9999",
          borderRadius: "12px",
        },
      });
    }
  };

  return (
    <motion.form
      initial={{ x: 0, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-8 w-80 mb-10 md:mb-0 md:ml-20 font-playful"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-[#4B814B] animate-pulse">
        🍌 Signup 🍌
      </h2>
      {/* Inputs here */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#3D6B3D]">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Enter username"
          className="w-full px-3 py-2 mt-1 border-2 border-[#A3C4A3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B77B] placeholder-[#7B9B7B]"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-[#3D6B3D]">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter email"
          className="w-full px-3 py-2 mt-1 border-2 border-[#A3C4A3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B77B] placeholder-[#7B9B7B]"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#3D6B3D]">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter password"
          className="w-full px-3 py-2 mt-1 border-2 border-[#A3C4A3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8B77B] placeholder-[#7B9B7B]"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-amber-200 text-[#3D6B3D] py-2 rounded-lg font-bold hover:bg-amber-300 transition-all duration-200"
      >
        Sign Up
      </button>
    </motion.form>
  );
};

export default SignupForm;
