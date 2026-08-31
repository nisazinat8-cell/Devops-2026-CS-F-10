function Home() {
  return (
    <main className="hero">
      <div className="heroContent">
        <h1>Find Your Dream Career</h1>

        <p>
          Discover the latest jobs and internships in one place.
        </p>

        <div className="searchBox">
          <input
            type="text"
            placeholder="Search jobs, skills or companies"
          />

          <input
            type="text"
            placeholder="Enter location"
          />

          <button type="button">Search</button>
        </div>
      </div>
    </main>
  );
}

export default Home;