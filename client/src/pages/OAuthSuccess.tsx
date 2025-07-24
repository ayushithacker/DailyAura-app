import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  console.log("🌐 FULL URL:", window.location.href);
  console.log("🔍 searchParams.get('token'):", searchParams.get("token"));

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("✅ Inside useEffect");
    console.log("🛑 Token:", token);

    if (token) {
      localStorage.setItem("token", token);
      toast.success("Login successful via Google 🙌");
      navigate("/");
    } else {
      toast.error("OAuth login failed.");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-20 text-lg">
      <p>Logging in via Google...</p>
      <p>Token: {searchParams.get("token") || "No token found"}</p>
    </div>
  );
};

export default OAuthSuccess;
