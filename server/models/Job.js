const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Internship", "Full Time", "Part Time"],
      default: "Full Time",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Helps the /api/jobs?search= endpoint match text quickly.
jobSchema.index({
  title: "text",
  company: "text",
  location: "text",
  description: "text",
});

module.exports = mongoose.model("Job", jobSchema);
