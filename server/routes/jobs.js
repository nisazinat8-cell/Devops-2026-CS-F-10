const express = require("express");
const Job = require("../models/Job");
const { isDBConnected } = require("../config/db");

const router = express.Router();

// Fallback in-memory jobs if MongoDB is offline during testing or quick demo
const fallbackJobs = [
  {
    _id: "66d6288a1000000000000001",
    title: "Full Stack Developer",
    company: "Tech Mahindra",
    location: "Jaipur",
    type: "Full Time",
    description: "Build robust MERN applications with modern React & Node.js.",
    createdAt: new Date(),
  },
  {
    _id: "66d6288a1000000000000002",
    title: "DevOps Engineer Intern",
    company: "CloudScale Systems",
    location: "Remote",
    type: "Internship",
    description: "Automate CI/CD pipelines with GitHub Actions, Jenkins, and Docker.",
    createdAt: new Date(),
  },
  {
    _id: "66d6288a1000000000000003",
    title: "Frontend Developer (React)",
    company: "Infosys",
    location: "Bangalore",
    type: "Full Time",
    description: "Design responsive Single Page Applications using React 19 and modern CSS.",
    createdAt: new Date(),
  },
  {
    _id: "66d6288a1000000000000004",
    title: "Python & Data Science Intern",
    company: "DataWorks AI",
    location: "Delhi NCR",
    type: "Internship",
    description: "Analyze datasets, build ML models, and integrate REST APIs.",
    createdAt: new Date(),
  },
  {
    _id: "66d6288a1000000000000005",
    title: "Backend Engineer (Node/Express)",
    company: "Zomato",
    location: "Gurugram",
    type: "Full Time",
    description: "Architect high-performance microservices, REST APIs, and MongoDB schemas.",
    createdAt: new Date(),
  },
];

// GET /api/jobs            -> all jobs
// GET /api/jobs?search=foo -> filtered jobs (title/company/location/type)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    if (isDBConnected()) {
      let query = {};
      if (search && search.trim() !== "") {
        const regex = new RegExp(search.trim(), "i");
        query = {
          $or: [
            { title: regex },
            { company: regex },
            { location: regex },
            { type: regex },
            { description: regex },
          ],
        };
      }

      const jobs = await Job.find(query).sort({ createdAt: -1 });
      if (jobs && jobs.length > 0) {
        return res.json({
          success: true,
          count: jobs.length,
          jobs,
        });
      }
    }

    // Fallback if DB is disconnected or empty
    let filtered = [...fallbackJobs];
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.type.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      jobs: filtered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch jobs.",
    });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      try {
        const job = await Job.findById(id);
        if (job) {
          return res.json({ success: true, job });
        }
      } catch (err) {
        // If invalid ObjectID format, fall through to fallback
      }
    }

    const fallback = fallbackJobs.find((j) => j._id === id);
    if (fallback) {
      return res.json({ success: true, job: fallback });
    }

    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }
});

// POST /api/jobs  -> create a job
router.post("/", async (req, res) => {
  try {
    const { title, company, location, type, description } = req.body;

    if (!title || !company || !location) {
      return res.status(400).json({
        success: false,
        message: "title, company and location are required.",
      });
    }

    if (isDBConnected()) {
      const job = await Job.create({
        title,
        company,
        location,
        type: type || "Full Time",
        description: description || "",
      });

      return res.status(201).json({ success: true, job });
    }

    // In-memory creation for demo/testing without Mongo
    const newJob = {
      _id: "66d6288a100000000000000" + (fallbackJobs.length + 1),
      title,
      company,
      location,
      type: type || "Full Time",
      description: description || "",
      createdAt: new Date(),
    };
    fallbackJobs.unshift(newJob);

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not create job.",
    });
  }
});

module.exports = router;
