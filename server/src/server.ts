import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./config/passport";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import journalRoutes from "./routes/journalRoutes"


dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        'https://dailyaura.netlify.app',
        'https://*.netlify.app'
      ]
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(passport.initialize());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api", authRoutes);
app.use("/api/journal", journalRoutes);

const PORT = parseInt(process.env.PORT || "5050");
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", PORT);
console.log("MongoDB URI exists:", !!MONGO_URI);

if (!MONGO_URI) {
  throw new Error("Missing MongoDB URI in environment variables");
}

app.get("/", (req, res) => {
  res.send("DailyAura API server is running");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Start server only after MongoDB connection
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
    
    // Then start the server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
