import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userSchema";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { logger } from "../utils/logger";

import { AuthRequest } from "../middleware/authMiddleware";
import { sendEmail } from "../utils/sendEmail";

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error('JWT_SECRET environment variable is required');
})();

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;
  const startTime = Date.now();

  logger.info('Registration attempt', { username, email }, 'AUTH_CONTROLLER');

  if (!username || !email || !password) {
    logger.warn('Registration failed - missing fields', { username, email }, 'AUTH_CONTROLLER');
    res.status(400).json({ error: "All fields are required!" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration failed - email already exists', { email }, 'AUTH_CONTROLLER');
      res.status(400).json({ error: "Email already in use!" });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();

    const duration = Date.now() - startTime;
    logger.logRegistration(username, email, true, 'AUTH_CONTROLLER');
    logger.logPerformance('User registration', duration, 'AUTH_CONTROLLER');

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Registration failed', error as Error, 'AUTH_CONTROLLER');
    logger.logPerformance('User registration (failed)', duration, 'AUTH_CONTROLLER');
    res.status(500).json({ error: "Server error." });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const startTime = Date.now();

  logger.info('Login attempt', { email }, 'AUTH_CONTROLLER');

  if (!email || !password) {
    logger.warn('Login failed - missing credentials', { email }, 'AUTH_CONTROLLER');
    res.status(400).json({ error: "Email and passwords are required!" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Login failed - user not found', { email }, 'AUTH_CONTROLLER');
      res.status(400).json({ error: "User not found!" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Login failed - invalid password', { email }, 'AUTH_CONTROLLER');
      res.status(401).json({ error: "Invalid password!" });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    const duration = Date.now() - startTime;
    logger.logAuthAttempt(email, true, 'AUTH_CONTROLLER');
    logger.logPerformance('User login', duration, 'AUTH_CONTROLLER');

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Login failed', error as Error, 'AUTH_CONTROLLER');
    logger.logPerformance('User login (failed)', duration, 'AUTH_CONTROLLER');
    res.status(500).json({ error: "Server error during login" });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user: userId } = req as AuthRequest;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user: userId } = req as AuthRequest;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res
      .status(400)
      .json({ error: "Both current and new password are required" });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password || "");
    if (!isMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error while changing password" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "No user found with this email" });
      return;
    }

    const token = randomBytes(32).toString("hex");
console.log(token,"---token")
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const FRONTEND_URL = process.env.FRONTEND_URL;
    const resetLink = `${FRONTEND_URL}reset-password/${token}`;
    console.log(resetLink,"---resetlik")

    const emailContent = `
      <h3>Reset Your Password</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(user.email, "Password-reset -  DailyAura", emailContent);
    res.status(200).json({
      message: "Reset link sent to your email.",
    });
  } catch (error) {
    console.error(error);   
    res.status(500).json({ error: "Error sending reset email." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "New password is required" });
  }
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invaild or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error during password reset" });
  }
};
