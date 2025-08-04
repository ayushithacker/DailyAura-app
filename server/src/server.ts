import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./config/passport";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import journalRoutes from "./routes/journalRoutes";
import { logger, requestLogger } from "./utils/logger";
import { errorHandler, notFound } from "./middleware/errorHandler";


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

// Structured request logging middleware
app.use(requestLogger);

app.use("/api", authRoutes);
app.use("/api/journal", journalRoutes);

const PORT = parseInt(process.env.PORT || "5050");
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

logger.info('Server configuration', {
  environment: process.env.NODE_ENV,
  port: PORT,
  mongoUriExists: !!MONGO_URI
}, 'SERVER_STARTUP');

if (!MONGO_URI) {
  logger.error('Missing MongoDB URI in environment variables', undefined, 'SERVER_STARTUP');
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
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV 
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server only after MongoDB connection
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected successfully', { uri: MONGO_URI }, 'SERVER_STARTUP');
    
    // Then start the server
    app.listen(PORT, () => {
      logger.info('Server started successfully', { 
        port: PORT, 
        environment: process.env.NODE_ENV || 'development' 
      }, 'SERVER_STARTUP');
    });
  } catch (error) {
    logger.error('Failed to start server', error as Error, 'SERVER_STARTUP');
    process.exit(1);
  }
};

startServer();
