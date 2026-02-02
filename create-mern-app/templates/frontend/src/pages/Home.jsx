import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Welcome to MERN App
        </h1>

        <p className="text-gray-600 mb-8">
          Build, manage, and scale your MERN apps like a pro.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full py-3 rounded-xl text-white font-semibold text-lg 
                     bg-gradient-to-r from-indigo-600 to-purple-600
                     hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          Login →
        </button>

        <p className="text-sm text-gray-500 mt-6">
          New here?{" "}
          <span className="text-indigo-600 font-medium cursor-pointer">
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Home;
