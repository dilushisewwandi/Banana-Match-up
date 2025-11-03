// This component was partially generated using an AI tool (ChatGPT).
// Tailwind CSS classes were adapted from official documentation: https://tailwindcss.com/docs

import { useState } from "react";
import axios from "axios";

//Functional component for Login form
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //Update form data 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Submitted:", formData);
    alert("Login Successful! 🍌");
  };

  //Form Interface
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-8 w-80 mb-10 md:mb-0 md:ml-20 font-playful"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-[#4B814B] animate-pulse">
        🍌 Login 🍌
      </h2>

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
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
