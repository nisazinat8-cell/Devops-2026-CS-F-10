// Run once with: node seed.js
// Populates the jobs collection with the same sample data
// that used to live in the in-memory array.

require("dotenv").config();

const mongoose = require("mongoose");
const Job = require("./models/Job");

const jobs = [
  {
    title: "Web Developer Intern",
    company: "Tech Solutions",
    location: "Jaipur",
    type: "Internship",
    description:
      "Work on websites using HTML, CSS and JavaScript.",
  },
  {
    title: "Python Developer",
    company: "Code World",
    location: "Remote",
    type: "Full Time",
    description:
      "Build Python applications and work with databases.",
  },
  {
    title: "Frontend Developer Intern",
    company: "Digital India",
    location: "Delhi",
    type: "Internship",
    description:
      "Create responsive user interfaces using JavaScript.",
  },
  {
    title: "Backend Developer",
    company: "Cloud Technologies",
    location: "Remote",
    type: "Full Time",
    description: "Develop APIs and server-side applications.",
  },
  {
    title: "Java Developer",
    company: "Software Hub",
    location: "Bangalore",
    type: "Full Time",
    description: "Develop applications using Java and MySQL.",
  },
  {
    title: "UI UX Designer",
    company: "Creative Studio",
    location: "Jaipur",
    type: "Internship",
    description:
      "Design attractive and user-friendly interfaces.",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding.");

    await Job.deleteMany({});
    await Job.insertMany(jobs);

    console.log(`Inserted ${jobs.length} jobs.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
