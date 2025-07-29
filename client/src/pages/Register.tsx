
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const newErrors = validate();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
  } else {
    try {
      const res = await api.post("/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.data.message || "Registration successful!");
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // Optional: Navigate to login
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Something went wrong during registration"
      );
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-6 sm:mb-8">
          Create Your Account
        </h1>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base ${
                errors.username ? "border-red-500" : "border"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.email ? "border-red-500" : "border"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full p-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.password ? "border-red-500" : "border-black"
                }`}
              />
            
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.confirmPassword ? "border-red-500" : "border"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-l from-rose-400 via-pink-350 to-purple-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Register
          </button>

          <p className="text-sm mt-4 text-center text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
