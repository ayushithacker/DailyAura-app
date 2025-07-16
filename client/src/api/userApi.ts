import axios from "axios";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get("http://localhost:5050/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { username, email, ... }
};
