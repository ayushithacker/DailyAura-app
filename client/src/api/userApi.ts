import axios from "axios";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // { username, email, ... }
};
