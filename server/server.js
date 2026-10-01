require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB, isDBConnected } = require("./config/db");
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Metric counters for Prometheus (DevOps Module 6: Observability & Metrics)
let totalRequests = 0;
let routeHitCounts = {};
const startTime = Date.now();

app.use(cors());
app.use(express.json());

// Metrics collection middleware
app.use((req, res, next) => {
  totalRequests++;
  const route = req.path;
  routeHitCounts[route] = (routeHitCounts[route] || 0) + 1;
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
app.get("/api/metrics", (req, res) => {
  const uptimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
  const mem = process.memoryUsage();
  const dbStatus = isDBConnected() ? 1 : 0;

  let metrics = `# HELP careerconnect_requests_total Total number of HTTP requests received
# TYPE careerconnect_requests_total counter
careerconnect_requests_total ${totalRequests}

# HELP careerconnect_uptime_seconds Process uptime in seconds
# TYPE careerconnect_uptime_seconds gauge
careerconnect_uptime_seconds ${uptimeSeconds}

# HELP careerconnect_database_connected Status of MongoDB connection (1 = connected, 0 = fallback)
# TYPE careerconnect_database_connected gauge
careerconnect_database_connected ${dbStatus}

# HELP careerconnect_memory_heap_used_bytes Memory heap used in bytes
# TYPE careerconnect_memory_heap_used_bytes gauge
careerconnect_memory_heap_used_bytes ${mem.heapUsed}
`;

  res.set("Content-Type", "text/plain; version=0.0.4");
  res.send(metrics);
});

// Mount Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

// 404 Route Handler
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
