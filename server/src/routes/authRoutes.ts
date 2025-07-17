import express, { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  changePassword,
  forgotPassword,
  getUserProfile,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/authControllers";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "Krishna";

// ✅ Traditional Auth Routes
router.post("/register", (req: Request, res: Response) => {
  registerUser(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  loginUser(req, res);
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", async (req: Request, res: Response) => {
  await resetPassword(req, res); // ✅ await async function
});

router.put("/change-password", authenticateToken, changePassword);
router.get("/profile", authenticateToken, getUserProfile);


router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });


    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);

  }
);

export default router;
