import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs from Express backend
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/jobs"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch jobs.");
        }

        const data = await response.json();

        setJobs(data.jobs);
        setError("");
      } catch (fetchError) {
        console.error(fetchError);

        setError(
          "Unable to connect to the backend server."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

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

        {loading && (
          <p className="statusMessage">
            Loading jobs...
          </p>
        )}

        {error && (
          <p className="errorMessage">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="jobContainer">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  className="jobCard"
                  key={job.id}
                >
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
                    onClick={() =>
                      applyJob(job.title)
                    }
                  >
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div className="noResults">
                <h3>No matching jobs found</h3>
                <p>
                  Try searching for another job.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="about" id="about">
        <h2>About CareerConnect</h2>

        <p>
          CareerConnect helps students and professionals
          find suitable jobs and internship opportunities.
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