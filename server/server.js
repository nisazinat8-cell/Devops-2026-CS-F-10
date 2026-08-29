require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerConnect backend is working!",
  });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

app.listen(PORT, () => {
  console.log(
    `CareerConnect server running at http://localhost:${PORT}`
  );
});
