import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Profile = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const token = localStorage.getItem("token");
        const res = await api.get("/user/profile", {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl max-w-md w-full p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
          👤 My Profile
        </h2>

        <div className="space-y-4 text-gray-700">
          <div>
            <span className="font-semibold">Username:</span> {profile.username}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {profile.email}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/change-password")}
            className="bg-yellow-400 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-500"
          >
            🔑 Change Password
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-4 py-2 rounded-md shadow hover:bg-red-500"
          >
            🚪 Logout
          </button>
        </div>

        <p className="mt-6 text-sm italic text-center text-purple-700">
          “Always think of Me, become My devotee.” — Bhagavad Gita 9.34
        </p>
      </div>
    </div>
  );
};

export default Profile;
