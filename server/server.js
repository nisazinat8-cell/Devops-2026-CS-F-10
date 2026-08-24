const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const jobs = [
  {
    id: 1,
    title: "Web Developer Intern",
    company: "Tech Solutions",
    location: "Jaipur",
  },
  {
    id: 2,
    title: "Python Developer",
    company: "Code World",
    location: "Remote",
  },
  {
    id: 3,
    title: "Frontend Developer Intern",
    company: "Digital India",
    location: "Delhi",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "Cloud Technologies",
    location: "Remote",
  },
];

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerConnect backend is working!",
  });
});

app.get("/api/jobs", (req, res) => {
  res.json({
    success: true,
    count: jobs.length,
    jobs: jobs,
  });
});

app.get("/api/jobs/:id", (req, res) => {
  const jobId = Number(req.params.id);

  const job = jobs.find((item) => {
    return item.id === jobId;
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  res.json({
    success: true,
    job: job,
  });
});

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