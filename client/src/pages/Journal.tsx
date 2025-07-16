import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";

const Journal: React.FC = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [chanting, setChanting] = useState("");
  const [rounds, setRounds] = useState("");
  const [reading, setReading] = useState("");
  const [katha, setKatha] = useState("");
  const [gratitude, setGratitude] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!chanting) newErrors.chanting = "Please select chanting status.";
    if (chanting === "yes" && (!rounds || parseInt(rounds) <= 0)) {
      newErrors.rounds = "Please enter valid number of rounds.";
    }
    if (!reading) newErrors.reading = "Please select reading status.";
    if (!katha) newErrors.katha = "Please select katha status.";
    if (!gratitude.trim()) newErrors.gratitude = "Gratitude can't be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // const token = localStorage.getItem("token");

      const response = await api.post(
        "/journal",
        {
          chanting: {
            status: chanting,
            rounds: chanting === "yes" ? Number(rounds) : undefined,
          },
          reading: { status: reading },
          katha: { status: katha },
          gratitude,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      toast.success(
        response.data.message || "Journal submitted successfully! 🙏"
      );

      // Clear form
      setChanting("");
      setRounds("");
      setReading("");
      setKatha("");
      setGratitude("");
      setErrors({});
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("You've already submitted today's journal! 📝");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to submit journal. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-100 via-blue-50 to-purple-100 shadow-md rounded-xl p-4 mb-6 text-center italic text-blue-700 font-medium text-sm">
        🌼 “Whatever you do, whatever you eat, whatever you offer or give away,
        and whatever austerities you perform – do that as an offering to Me.” —
        Bhagavad Gita 9.27
      </div>

      <div className="mb-6">
        <h2 className="text-blue-800 font-bold text-xl">
          Welcome to Your Journal 🌿
        </h2>
        <p className="text-gray-600 text-sm">{today}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow space-y-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Devotional Activities
          </h3>

          {/* Chanting */}
          <div className="grid md:grid-cols-3 items-center gap-4">
            <label className="text-gray-700 font-medium">📿 Chanting</label>
            <select
              value={chanting}
              onChange={(e) => setChanting(e.target.value)}
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">Not yet</option>
            </select>
            {chanting === "yes" && (
              <input
                type="number"
                placeholder="How many rounds?"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                className="p-2 border rounded-md focus:ring-2 focus:ring-purple-400"
              />
            )}
          </div>
          {errors.chanting && (
            <p className="text-red-600 text-sm">{errors.chanting}</p>
          )}
          {errors.rounds && (
            <p className="text-red-600 text-sm">{errors.rounds}</p>
          )}

          {/* Reading */}
          <div className="grid md:grid-cols-3 items-center gap-4">
            <label className="text-gray-700 font-medium">📖 Reading</label>
            <select
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              className="col-span-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">Not yet</option>
            </select>
          </div>
          {errors.reading && (
            <p className="text-red-600 text-sm">{errors.reading}</p>
          )}

          {/* Katha */}
          <div className="grid md:grid-cols-3 items-center gap-4">
            <label className="text-gray-700 font-medium">
              🎧 Krishna Katha / Lecture?
            </label>
            <select
              value={katha}
              onChange={(e) => setKatha(e.target.value)}
              className="col-span-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">Not yet</option>
            </select>
          </div>
          {errors.katha && (
            <p className="text-red-600 text-sm">{errors.katha}</p>
          )}
        </div>

        {/* 💛 Gratitude Section */}
        <div className="bg-yellow-50/60 backdrop-blur-md p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            💛 What are you grateful for today?
          </h3>
          <textarea
            rows={4}
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="Write 1 or 2 things you feel grateful for today..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          ></textarea>
          {errors.gratitude && (
            <p className="text-red-600 text-sm">{errors.gratitude}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="text-center pt-6">
          <button
            type="submit"
            className="bg-gradient-to-l  from-rose-400 via-pink-350 to-purple-500 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Save Journal Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default Journal;
