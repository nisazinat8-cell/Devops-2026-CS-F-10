import { useState } from "react";

function Internships() {
  const [search, setSearch] = useState("");

  const internships = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "TechNova",
      location: "Remote",
      duration: "3 months",
    },
    {
      id: 2,
      title: "Python Developer Intern",
      company: "CodeSphere",
      location: "Jaipur",
      duration: "6 months",
    },
    {
      id: 3,
      title: "Data Science Intern",
      company: "DataWorks",
      location: "Hybrid",
      duration: "4 months",
    },
  ];

  const filteredInternships = internships.filter((internship) => {
    const value = search.toLowerCase();

    return (
      internship.title.toLowerCase().includes(value) ||
      internship.company.toLowerCase().includes(value) ||
      internship.location.toLowerCase().includes(value)
    );
  });

  function applyInternship(title) {
    const loggedInUser =
      localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("Please login before applying.");
      return;
    }

    alert(`Application started for ${title}`);
  }

  return (
    <main className="jobs page">
      <h1>Available Internships</h1>

      <input
        type="text"
        className="pageSearch"
        placeholder="Search internships"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="jobContainer">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((internship) => (
            <div className="jobCard" key={internship.id}>
              <h3>{internship.title}</h3>

              <p>
                <strong>Company:</strong>{" "}
                {internship.company}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {internship.location}
              </p>

              <p>
                <strong>Duration:</strong>{" "}
                {internship.duration}
              </p>

              <button
                type="button"
                onClick={() =>
                  applyInternship(internship.title)
                }
              >
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <p>No matching internships found.</p>
        )}
      </div>
    </main>
  );
}

export default Internships;