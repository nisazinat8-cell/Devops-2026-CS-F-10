require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const promClient = require("prom-client");

const { connectDB, isDBConnected } = require("./config/db");
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize prom-client default metrics for NodeJS Application Dashboard (ID 11159)
promClient.collectDefaultMetrics({ register: promClient.register });

// Custom metric gauges & counters for CareerConnect
const customRequestsCounter = new promClient.Counter({
  name: "careerconnect_requests_total",
  help: "Total number of HTTP requests received",
});

const customUptimeGauge = new promClient.Gauge({
  name: "careerconnect_uptime_seconds",
  help: "Process uptime in seconds",
});

const customDbGauge = new promClient.Gauge({
  name: "careerconnect_database_connected",
  help: "Status of MongoDB connection (1 = connected, 0 = fallback)",
});

const startTime = Date.now();

app.use(cors());
app.use(express.json());

// Metrics collection middleware
app.use((req, res, next) => {
  customRequestsCounter.inc();
  next();
});

// Connect to MongoDB
connectDB();

// Health check endpoint (DevOps Module 4 & 5: Container Health Checks)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    database: isDBConnected() ? "connected" : "disconnected (using fallback)",
    message: "CareerConnect backend is running smoothly!",
  });
});

// Prometheus Metrics Endpoint (DevOps Module 6: Prometheus & Grafana)
app.get("/api/metrics", async (req, res) => {
  try {
    customUptimeGauge.set(Math.floor((Date.now() - startTime) / 1000));
    customDbGauge.set(isDBConnected() ? 1 : 0);

    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Mount Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

// Serve frontend static assets if built (Single Web Service deployment e.g. on Render)
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
}

// 404 Route Handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(
      `CareerConnect backend running at http://localhost:${PORT}`
    );
  });
}

module.exports = { app, server };
