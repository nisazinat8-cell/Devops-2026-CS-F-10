import { useEffect, useState } from "react";

const starterInternships = [
  {
    _id: "intern_1",
    title: "DevOps & Cloud Intern",
    company: "CloudScale Systems",
    location: "Remote",
    stipend: "₹15,000 / month",
    duration: "6 Months",
    description: "Hands-on experience with Docker, Jenkins CI/CD, Kubernetes, and AWS.",
  },
  {
    _id: "intern_2",
    title: "Frontend React Developer Intern",
    company: "TechNova Studio",
    location: "Jaipur",
    stipend: "₹12,000 / month",
    duration: "3 Months",
    description: "Build interactive user components and SPAs with React 19 and Vite.",
  },
  {
    _id: "intern_3",
    title: "Python & Machine Learning Intern",
    company: "DataWorks AI",
    location: "Hybrid (Delhi NCR)",
    stipend: "₹18,000 / month",
    duration: "4 Months",
    description: "Train models, perform exploratory data analysis, and expose REST APIs.",
  },
  {
    _id: "intern_4",
    title: "Backend Node.js & Mongo Intern",
    company: "Zomato Tech",
    location: "Gurugram",
    stipend: "₹20,000 / month",
    duration: "6 Months",
    description: "Design Mongoose schemas, secure JWT authentication, and Express routes.",
  },
];

function Internships() {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:5000/api/jobs?search=internship", {
          signal: AbortSignal.timeout(2000),
        });
        if (res.ok) {
          const data = await res.json();
          const apiInternships = (data.jobs || []).filter(
            (j) => (j.type || "").toLowerCase().includes("intern")
          );
          if (apiInternships.length > 0) {
            setInternships(apiInternships);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // Fallback
      }
      setInternships(starterInternships);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = internships.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  function applyInternship(title, company) {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      alert("Please login first to apply for internships.");
      return;
    }
    alert(`Application submitted for ${title} at ${company}!`);
  }

  return (
    <main className="jobs page">
      <div className="pageHeader">
        <h1>Student & Graduate Internships</h1>
        <p>Accelerate your career with curated internship programs from top industry partners.</p>
      </div>

      <div className="searchAndFilter">
        <input
          type="text"
          className="pageSearch"
          placeholder="Search internships by skill, company or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="statusMessage">Loading internships...</p>}

      {!loading && (
        <div className="jobContainer">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div className="jobCard" key={item._id || item.id || item.title}>
                <div className="jobCardHeader">
                  <h3>{item.title}</h3>
                  <span className="jobTypeBadge badgeInternship">Internship</span>
                </div>

                <p className="jobCompany">🏢 <strong>{item.company}</strong></p>
                <p className="jobLocation">📍 {item.location}</p>
                {item.stipend && <p>💰 <strong>Stipend:</strong> {item.stipend}</p>}
                {item.duration && <p>⏱️ <strong>Duration:</strong> {item.duration}</p>}
                <p className="jobDescription">{item.description}</p>

                <button
                  type="button"
                  className="applyButton"
                  onClick={() => applyInternship(item.title, item.company)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <p className="noResults">No matching internships found.</p>
          )}
        </div>
      )}
    </main>
  );
}

export default Internships;