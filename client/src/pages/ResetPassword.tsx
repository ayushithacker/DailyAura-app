import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../api/api";

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  useEffect(() => {
    if (!token) {
      toast.error("Reset token missing");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await toast.promise(
        api.post(`/reset-password/${token}`, {
          password: formData.newPassword,
        }),

        {
          loading: "Resetting password...",
          success: "Password reset successful! 🎉",
          error: (err) =>
            err?.response?.data?.message ||
            "Something went wrong. Try again later.",
        }
      );

      navigate("/login");
    } catch (err: any) {
      console.log("Reset failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-purple-600 text-center mb-8">
          Reset Your Password
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="relative">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`w-full p-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  errors.newPassword ? "border-red-500" : "border-black"
                }`}
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                errors.confirmPassword ? "border-red-500" : "border-black"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-l from-rose-400 via-pink-350 to-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Reset Password
          </button> */}
          <button
            disabled={loading}
            className={`w-full mt-4 bg-gradient-to-l from-rose-400 via-pink-350 to-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
