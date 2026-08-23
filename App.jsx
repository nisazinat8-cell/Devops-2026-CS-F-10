import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

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

function App() {
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const searchValue = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(searchValue) ||
      job.company.toLowerCase().includes(searchValue) ||
      job.location.toLowerCase().includes(searchValue)
    );
  });

  function applyJob(jobTitle) {
    const loggedInUser =
      localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("Please login before applying for a job.");
      return;
    }

    alert(`Application started for ${jobTitle}`);
  }

  return (
    <div>
      <Navbar />

      <section className="hero" id="home">
        <h1>Find Your Dream Career</h1>

        <p>
          Search for jobs and internships in one place.
        </p>

        <input
          type="text"
          placeholder="Search job, company or location"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </section>

      <section className="jobs" id="jobs">
        <h2>Latest Opportunities</h2>

        <div className="jobContainer">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="jobCard" key={job.id}>
                <h3>{job.title}</h3>

                <p>
                  <strong>Company:</strong>{" "}
                  {job.company}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {job.location}
                </p>

                <button
                  type="button"
                  onClick={() => applyJob(job.title)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <div className="noResults">
              <h3>No matching jobs found</h3>
              <p>Try searching for another job.</p>
            </div>
          )}
        </div>
      </section>

      <section className="about" id="about">
        <h2>About CareerConnect</h2>

        <p>
          CareerConnect helps students and
          professionals find suitable jobs and
          internship opportunities.
        </p>
      </section>

      <footer>
        <p>
          © 2026 CareerConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;