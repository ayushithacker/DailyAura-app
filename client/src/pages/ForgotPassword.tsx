import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    console.log("Sending request to backend...");
    try {
      await toast.promise(api.post("/forgot-password", { email }), {
        loading: "Sending reset link...",
        success: (res) => res.data.message || "Reset link sent successfully!",
        error: (err) =>
          err?.response?.data?.error || "Something went wrong. Try again.",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Forgot Password
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                error ? "border-red-500" : "border-black"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-l from-rose-400 via-pink-350 to-purple-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Send Reset Link
          </button>

          <p className="text-sm mt-4 text-center text-gray-700">
            Go back to{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
