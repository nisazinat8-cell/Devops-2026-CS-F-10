const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// GET /api/jobs            -> all jobs
// GET /api/jobs?search=foo -> filtered jobs (title/company/location/type)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

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

    res.json({
      success: true,
      count: jobs.length,
      jobs,
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
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    res.json({ success: true, job });
  } catch (error) {
    // Invalid ObjectId also lands here
    res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }
});

// POST /api/jobs  -> create a job (e.g. for an admin panel later)
router.post("/", async (req, res) => {
  try {
    const { title, company, location, type, description } =
      req.body;

    if (!title || !company || !location) {
      return res.status(400).json({
        success: false,
        message: "title, company and location are required.",
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not create job.",
    });
  }
});

module.exports = router;
