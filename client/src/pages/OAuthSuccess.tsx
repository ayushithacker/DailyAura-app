import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  console.log("🌐 OAuthSuccess Component Loaded");
  console.log("🌐 FULL URL:", window.location.href);
  console.log("🔍 searchParams.get('token'):", searchParams.get("token"));

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("✅ Inside useEffect");
    console.log("🛑 Token:", token);

    if (token) {
      try {
        localStorage.setItem("token", token);
        toast.success("Login successful via Google 🙌");
        console.log("✅ Token saved, redirecting to dashboard");
        navigate("/dashboard");
      } catch (error) {
        console.error("❌ Error saving token:", error);
        toast.error("Failed to save login token");
        navigate("/login");
      }
    } else {
      console.log("❌ No token found");
      toast.error("OAuth login failed - no token received");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Logging in via Google...
        </h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Token: {searchParams.get("token") ? "Present" : "No token found"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          If this page doesn't redirect automatically, please wait...
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
