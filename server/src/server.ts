import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./config/passport";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes";
import journalRoutes from "./routes/journalRoutes"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "some-session-secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());

app.use("/api", authRoutes);
app.use("/api/journal", journalRoutes);
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

const PORT = parseInt(process.env.PORT || "5050"); // <- fixed here

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Missing MongoDB URI in environment variables");
}

app.get("/", (req, res) => {
  res.send("server is running");
});

// ✅ FIXED HERE
app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});

// Mongo connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((e) => console.error("MongoDB error", e));
