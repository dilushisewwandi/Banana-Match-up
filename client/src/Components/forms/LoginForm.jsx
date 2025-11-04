// This component was partially generated using an AI tool (ChatGPT).
// Tailwind CSS classes were adapted from official documentation: https://tailwindcss.com/docs

import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Functional component for Login form
const LoginForm = () => {
  const navigate = useNavigate();
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("🍌 Login Successful! Let’s play!", {
          style: {
            background: "#E9FFE7",
            color: "#256029",
            border: "2px solid #B5E48C",
            borderRadius: "12px",
          },
        });
        localStorage.setItem("token", data.token);
        setFormData({ email: "", password: "" });
        navigate("/welcome");
      } else {
        toast.error(`😢 ${data.message || "Invalid credentials!"}`, {
          style: {
            background: "#FFEAEA",
            color: "#A50E0E",
            border: "2px solid #FF9999",
            borderRadius: "12px",
          },
        });
      }
    } catch (err) {
      toast.error("⚠️ Oops! Server not responding.", {
        style: {
          background: "#FFF1E1",
          color: "#B85C00",
          border: "2px solid #FEC260",
          borderRadius: "12px",
        },
      });
    }
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


