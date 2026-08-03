import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import weatherRoutes from "./routes/weather.js";
import cityRoutes from "./routes/cityRoutes.js";
import forecastRoutes from "./routes/forecast.js";
import phoneAuthRoutes from "./routes/phoneAuthRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Home
app.get("/", (req, res) => {
  res.send("🚀 Aetherix Backend Running");
});

// Auth
app.use("/api/auth", authRoutes);

app.use("/api/phone", phoneAuthRoutes);

//test routes
app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});


// Weather
app.use("/api/weather", weatherRoutes);

// Forecast
app.use("/api/forecast", forecastRoutes);

// Cities
app.use("/api/cities", cityRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});