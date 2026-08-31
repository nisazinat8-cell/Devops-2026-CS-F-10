import { useEffect, useState } from "react";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to connect to the backend server.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const value = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(value) ||
      job.company.toLowerCase().includes(value) ||
      job.location.toLowerCase().includes(value)
    );
  });

  function applyJob(jobTitle) {
    const loggedInUser =
      localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("Please login before applying.");
      return;
    }

    alert(`Application started for ${jobTitle}`);
  }

  return (
    <main className="jobs page">
      <h1>Available Jobs</h1>

      <input
        type="text"
        className="pageSearch"
        placeholder="Search by title, company or location"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading && <p>Loading jobs...</p>}

      {error && <p className="errorMessage">{error}</p>}

      {!loading && !error && (
        <div className="jobContainer">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="jobCard" key={job.id}>
                <h3>{job.title}</h3>

                <p>
                  <strong>Company:</strong> {job.company}
                </p>

                <p>
                  <strong>Location:</strong> {job.location}
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
            <p>No matching jobs found.</p>
          )}
        </div>
      )}
    </main>
  );
}

export default Jobs;