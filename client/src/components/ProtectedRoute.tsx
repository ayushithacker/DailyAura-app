import React, { useEffect,  useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

let toastShown = false;

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined" && token !== "null" && token.trim() !== "";
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const tokenValid = isTokenValid();

  useEffect(() => {
    // wait until Toaster is mounted
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && !tokenValid) {
      if (!toastShown) {
        toast.error("Please login first");
        toastShown = true;
      }

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 800);
    }
  }, [ready, tokenValid, navigate]);

  if (!ready) return null;
  if (!tokenValid) return null;

  toastShown = false;
  return <>{children}</>;
};

export default ProtectedRoute;
