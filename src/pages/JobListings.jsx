import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultFallbackJobs = [
  {
    _id: "66d6288a1000000000000001",
    title: "Full Stack Developer",
    company: "Tech Mahindra",
    location: "Jaipur",
    type: "Full Time",
    salary: "₹6–10 LPA",
    postedDaysAgo: 1,
    description: "Build robust MERN applications with modern React & Node.js.",
  },
  {
    _id: "66d6288a1000000000000002",
    title: "DevOps Engineer Intern",
    company: "CloudScale Systems",
    location: "Remote",
    type: "Internship",
    salary: "₹15,000 / month",
    postedDaysAgo: 0,
    description: "Automate CI/CD pipelines with GitHub Actions, Jenkins, and Docker.",
  },
  {
    _id: "66d6288a1000000000000003",
    title: "Frontend Developer (React)",
    company: "Infosys",
    location: "Bangalore",
    type: "Full Time",
    salary: "₹5–8 LPA",
    postedDaysAgo: 3,
    description: "Design responsive Single Page Applications using React 19 and modern CSS.",
  },
  {
    _id: "66d6288a1000000000000004",
    title: "Python & Data Science Intern",
    company: "DataWorks AI",
    location: "Delhi NCR",
    type: "Internship",
    salary: "₹12,000 / month",
    postedDaysAgo: 5,
    description: "Analyze datasets, build ML models, and integrate REST APIs.",
  },
  {
    _id: "66d6288a1000000000000005",
    title: "Backend Engineer (Node/Express)",
    company: "Zomato",
    location: "Gurugram",
    type: "Full Time",
    salary: "₹8–14 LPA",
    postedDaysAgo: 2,
    description: "Architect high-performance microservices, REST APIs, and MongoDB schemas.",
  },
];

function formatPosted(days) {
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  return `Posted ${days} days ago`;
}

function getJobId(job) {
  return job._id || job.id || job.title;
}

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState("");

  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedJobs")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    let cancelled = false;

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
        if (cancelled) return;
        setJobs(data.jobs || []);
        setApiNotice("");
      } catch (fetchError) {
        if (cancelled) return;
        console.warn("Backend unavailable, using fallback jobs:", fetchError);

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
        if (!cancelled) setLoading(false);
      }
    }

    // Wait 300ms after the user stops typing before calling the server
    const timer = setTimeout(fetchJobs, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  const filteredJobs = jobs.filter((job) => {
    if (selectedType === "All") return true;
    if (selectedType === "Saved") return savedIds.includes(getJobId(job));
    return (job.type || "").toLowerCase().includes(selectedType.toLowerCase());
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "company") return a.company.localeCompare(b.company);
    if (sortBy === "newest") {
      return (a.postedDaysAgo ?? 999) - (b.postedDaysAgo ?? 999);
    }
    return 0;
  });

  function toggleSave(id) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

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
          {["All", "Full Time", "Internship", "Saved"].map((type) => (
            <button
              key={type}
              type="button"
              className={`filterChip ${selectedType === type ? "active" : ""}`}
              onClick={() => setSelectedType(type)}
            >
              {type === "Saved" ? `♥ Saved (${savedIds.length})` : type}
            </button>
          ))}
        </div>
      </div>

      {apiNotice && <div className="noticeBanner">{apiNotice}</div>}

      {loading && <p className="statusMessage">Loading opportunities...</p>}

      {!loading && (
        <>
          <div className="resultsBar">
            <p className="resultsCount">
              Showing {sortedJobs.length}{" "}
              {sortedJobs.length === 1 ? "opportunity" : "opportunities"}
            </p>

            <select
              className="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort jobs"
            >
              <option value="default">Sort: Default</option>
              <option value="newest">Sort: Newest first</option>
              <option value="title">Sort: Title A–Z</option>
              <option value="company">Sort: Company A–Z</option>
            </select>
          </div>

          <div className="jobContainer">
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job) => {
                const id = getJobId(job);
                const isSaved = savedIds.includes(id);

                return (
                  <div className="jobCard" key={id}>
                    <div className="jobCardHeader">
                      <h3>{job.title}</h3>
                      <div className="jobCardActions">
                        <span
                          className={`jobTypeBadge ${
                            job.type === "Internship" ? "badgeInternship" : "badgeFullTime"
                          }`}
                        >
                          {job.type || "Full Time"}
                        </span>
                        <button
                          type="button"
                          className={`saveButton ${isSaved ? "saved" : ""}`}
                          onClick={() => toggleSave(id)}
                          aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
                          title={isSaved ? "Remove from saved" : "Save job"}
                        >
                          {isSaved ? "♥" : "♡"}
                        </button>
                      </div>
                    </div>

                    <p className="jobCompany">
                      🏢 <strong>{job.company}</strong>
                    </p>
                    <p className="jobLocation">📍 {job.location}</p>
                    {job.salary && <p className="jobSalary">💰 {job.salary}</p>}
                    {job.postedDaysAgo !== undefined && (
                      <p className="jobPosted">🕒 {formatPosted(job.postedDaysAgo)}</p>
                    )}
                    <p className="jobDescription">{job.description}</p>

                    <button
                      type="button"
                      className="applyButton"
                      onClick={() => applyJob(job.title, job.company)}
                    >
                      Apply Now
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="noResults">
                <h3>No matching opportunities found</h3>
                <p>Try searching for a different skill or clearing your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedType("All");
                    setSortBy("default");
                    setSearchParams({});
                  }}
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Jobs;