import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/jobs");
    }
  }

  function handleTagClick(tag) {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  }

  return (
    <main>
      <section className="hero">
        <div className="heroContent">
          <h1>Find Your Dream Career</h1>
          <p>
            Explore verified opportunities across top engineering and tech companies.
          </p>

          <form className="searchBox" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by job title, skill (e.g. React, Python), or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search Jobs</button>
          </form>

          <div className="quickTags">
            <span>Popular:</span>
            <button type="button" onClick={() => handleTagClick("React")}>React</button>
            <button type="button" onClick={() => handleTagClick("Python")}>Python</button>
            <button type="button" onClick={() => handleTagClick("Full Stack")}>Full Stack</button>
            <button type="button" onClick={() => handleTagClick("DevOps")}>DevOps</button>
            <button type="button" onClick={() => handleTagClick("Internship")}>Internships</button>
          </div>
        </div>
      </section>

      <section className="featuresSection">
        <div className="featuresContainer">
          <div className="featureCard">
            <div className="featureIcon">🚀</div>
            <h3>Verified Opportunities</h3>
            <p>Direct openings from verified tech firms, startups, and enterprise companies.</p>
          </div>

          <div className="featureCard">
            <div className="featureIcon">⚙️</div>
            <h3>DevOps-Powered</h3>
            <p>Continuous Integration, Dockerized deployment, and Prometheus monitoring.</p>
          </div>

          <div className="featureCard">
            <div className="featureIcon">⚡</div>
            <h3>Fast & Lightweight</h3>
            <p>Single Page Application built with React 19, Vite, and high-performance REST APIs.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;