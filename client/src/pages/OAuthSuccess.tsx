import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      toast.success("Login successful via Google 🙌");
      navigate("/"); 
    } else {
      toast.error("OAuth login failed.");
      navigate("/login");
    }
  }, []);

  return <p className="text-center mt-20 text-lg">Logging in via Google...</p>;
};

export default OAuthSuccess;
