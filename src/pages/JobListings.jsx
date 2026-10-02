import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultFallbackJobs = [
  {
    _id: "66d6288a1000000000000001",
    title: "Full Stack Developer",
    company: "Tech Mahindra",
    location: "Jaipur",
    type: "Full Time",
    description: "Build robust MERN applications with modern React & Node.js.",
  },
  {
    _id: "66d6288a1000000000000002",
    title: "DevOps Engineer Intern",
    company: "CloudScale Systems",
    location: "Remote",
    type: "Internship",
    description: "Automate CI/CD pipelines with GitHub Actions, Jenkins, and Docker.",
  },
  {
    _id: "66d6288a1000000000000003",
    title: "Frontend Developer (React)",
    company: "Infosys",
    location: "Bangalore",
    type: "Full Time",
    description: "Design responsive Single Page Applications using React 19 and modern CSS.",
  },
  {
    _id: "66d6288a1000000000000004",
    title: "Python & Data Science Intern",
    company: "DataWorks AI",
    location: "Delhi NCR",
    type: "Internship",
    description: "Analyze datasets, build ML models, and integrate REST APIs.",
  },
  {
    _id: "66d6288a1000000000000005",
    title: "Backend Engineer (Node/Express)",
    company: "Zomato",
    location: "Gurugram",
    type: "Full Time",
    description: "Architect high-performance microservices, REST APIs, and MongoDB schemas.",
  },
];

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState("");

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const queryParam = search ? `?search=${encodeURIComponent(search)}` : "";
        const response = await fetch(`http://localhost:5000/api/jobs${queryParam}`, {
          signal: AbortSignal.timeout(2500),
        });

        if (!response.ok) {
          throw new Error("Unable to fetch jobs from server.");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
        setApiNotice("");
      } catch (fetchError) {
        // Fallback for offline demo mode
        let filtered = defaultFallbackJobs;
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (j) =>
              j.title.toLowerCase().includes(q) ||
              j.company.toLowerCase().includes(q) ||
              j.location.toLowerCase().includes(q) ||
              j.type.toLowerCase().includes(q)
          );
        }
        setJobs(filtered);
        setApiNotice("Displaying cached catalog (backend offline/demo mode).");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [search]);

  const filteredJobs = jobs.filter((job) => {
    if (selectedType === "All") return true;
    return (job.type || "").toLowerCase().includes(selectedType.toLowerCase());
  });

  function applyJob(jobTitle, company) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      alert("Please login first to submit your application.");
      return;
    }
    alert(`Application submitted successfully for ${jobTitle} at ${company}!`);
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearch(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  }

  return (
    <main className="jobs page">
      <div className="pageHeader">
        <h1>Latest Career Opportunities</h1>
        <p>Browse through full-time roles and internships matching your tech stack.</p>
      </div>

      <div className="searchAndFilter">
        <input
          type="text"
          className="pageSearch"
          placeholder="Filter by job title, company, or skills..."
          value={search}
          onChange={handleSearchChange}
        />

        <div className="filterChips">
          {["All", "Full Time", "Internship"].map((type) => (
            <button
              key={type}
              type="button"
              className={`filterChip ${selectedType === type ? "active" : ""}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {apiNotice && <div className="noticeBanner">{apiNotice}</div>}

      {loading && <p className="statusMessage">Loading opportunities...</p>}

      {!loading && (
        <div className="jobContainer">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="jobCard" key={job._id || job.id || job.title}>
                <div className="jobCardHeader">
                  <h3>{job.title}</h3>
                  <span className={`jobTypeBadge ${job.type === "Internship" ? "badgeInternship" : "badgeFullTime"}`}>
                    {job.type || "Full Time"}
                  </span>
                </div>

                <p className="jobCompany">
                  🏢 <strong>{job.company}</strong>
                </p>
                <p className="jobLocation">
                  📍 {job.location}
                </p>
                <p className="jobDescription">{job.description}</p>

                <button
                  type="button"
                  className="applyButton"
                  onClick={() => applyJob(job.title, job.company)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <div className="noResults">
              <h3>No matching opportunities found</h3>
              <p>Try searching for a different skill or clearing your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedType("All");
                  setSearchParams({});
                }}
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default Jobs;