import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import api from "../api/api";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const todayDisplay = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayDateStr = new Date().toISOString().split("T")[0]; // "2025-07-09"

  const moods = ["😊", "😐", "😔", "🥹", "😇"];
  const moodMessages: Record<string, string> = {
    "😊": "Stay joyful and grateful 🌸",
    "😐": "Just breathe and chant 🕉️",
    "😔": "Krishna is near. Offer your pain 💙",
    "🥹": "You're loved even in tears 🌧️",
    "😇": "May you serve Krishna with peace 🙏",
  };
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [todayJournal, setTodayJournal] = useState<any>(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        // const token = localStorage.getItem("token");
        const res = await api.get("/journal", {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });

        const todayEntry = res.data.find(
          (entry: any) => entry.date === todayDateStr
        );
        setTodayJournal(todayEntry || null);
      } catch (err) {
        console.error("Error fetching journal", err);
      }
    };

    fetchJournal();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-100 via-blue-50 to-purple-100 shadow-md rounded-xl p-4 mb-6 text-center italic text-blue-700 font-medium text-sm">
        🪶 “Even a little effort on this path can save one from great fear.” —
        Bhagavad Gita 2.40
      </div>

      <div className="m-6">
        <p className="text-blue-800 font-bold text-xl my-2">
          Hare Krishna, {user?.username.toUpperCase()}
        </p>
        <div className="text-md text-gray-600">{todayDisplay}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 🕉️ Daily Devotion */}
        <div className="bg-blue-50 w-full rounded-lg p-6">
          <p className="font-bold text-xl mb-4">🕉️ Daily Devotion</p>
          {todayJournal ? (
            <ul className="text-gray-700 space-y-1">
              <li>
                📿 <strong>Chanting:</strong> {todayJournal.chanting.status}
                {todayJournal.chanting.status === "yes"
                  ? ` (${todayJournal.chanting.rounds} rounds)`
                  : ""}
              </li>
              <li>
                📖 <strong>Reading:</strong> {todayJournal.reading.status}
              </li>
              <li>
                🎧 <strong>Katha:</strong> {todayJournal.katha.status}
              </li>
            </ul>
          ) : (
            <p className="text-gray-700">
              No devotional activities filled for today.
            </p>
          )}
        </div>

        {/* 📔 Journal - Gratitude only */}
        <div className="bg-blue-50 w-full rounded-md min-h-40 p-6">
          <p className="font-bold text-xl mb-4">📔 Journal</p>
          {todayJournal ? (
            <div className="text-gray-800">
              <p>
                <strong>🙏 Gratitude:</strong> {todayJournal.gratitude}
              </p>
            </div>
          ) : (
            <p className="text-gray-700">
              You haven’t written today's journal yet.
            </p>
          )}
        </div>
      </div>

      <div className="my-6">
        <div className="bg-blue-50 rounded-md p-6 flex flex-col items-center">
          <p className="font-bold text-xl mb-4">
            🎭 How are you feeling today?
          </p>
          <div className="flex gap-4 text-3xl flex-wrap justify-center">
            {moods.map((mood) => (
              <span
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`cursor-pointer transition-all hover:scale-125 duration-150 ${
                  selectedMood === mood
                    ? "ring-2 ring-blue-500 bg-white rounded-full p-1 shadow"
                    : ""
                }`}
              >
                {mood}
              </span>
            ))}
          </div>
          {selectedMood && (
            <p className="text-blue-700 font-medium mt-2">
              {moodMessages[selectedMood]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
