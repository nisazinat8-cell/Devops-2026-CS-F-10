function About() {
  return (
    <main className="aboutPage">
      <div className="aboutHeader">
        <h1>About CareerConnect</h1>
        <p className="aboutSubtitle">
          A production-ready Full Stack & DevOps showcase developed for B.Tech CSE (Sem V).
        </p>
      </div>

      <div className="aboutContent">
        <section className="aboutCard">
          <h2>🎯 Project Objective</h2>
          <p>
            CareerConnect is a unified portal connecting students and professionals with employment
            and internship opportunities. Built to demonstrate best practices in modern Full Stack Web
            Development and automated DevOps CI/CD engineering.
          </p>
        </section>

        <section className="aboutCard">
          <h2>💻 Full Stack Architecture (CSUL504)</h2>
          <div className="techGrid">
            <div className="techBadge">
              <strong>Frontend SPA:</strong> React 19, React Router v7, Vite, Responsive CSS
            </div>
            <div className="techBadge">
              <strong>Backend REST API:</strong> Node.js, Express.js, JWT Authentication, CORS
            </div>
            <div className="techBadge">
              <strong>Database:</strong> MongoDB with Mongoose ODM, bcrypt password encryption
            </div>
            <div className="techBadge">
              <strong>Legacy Component:</strong> Vanilla JavaScript DOM manipulation & CSS3 (Module 2 & 3)
            </div>
          </div>
        </section>

        <section className="aboutCard">
          <h2>⚙️ DevOps Practices & Principles (CSUL511)</h2>
          <div className="techGrid">
            <div className="techBadge">
              <strong>Version Control:</strong> Git repository management, feature branches, semantic commits
            </div>
            <div className="techBadge">
              <strong>Continuous Integration:</strong> GitHub Actions workflow & declarative Jenkinsfile pipeline
            </div>
            <div className="techBadge">
              <strong>Automated Testing:</strong> Node.js native test runner checking endpoints and authentication
            </div>
            <div className="techBadge">
              <strong>Containerization:</strong> Docker multi-stage builds & Docker Compose multi-service orchestration
            </div>
            <div className="techBadge">
              <strong>Kubernetes:</strong> Production manifests for Deployments, ClusterIP Services, and Health Probes
            </div>
            <div className="techBadge">
              <strong>Observability:</strong> Prometheus <code>/api/metrics</code> exporter for system monitoring
            </div>
          </div>
        </section>

        <section className="aboutCard academicCard">
          <h2>🎓 Academic Context</h2>
          <p>
            <strong>Institution:</strong> Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur<br />
            <strong>Department:</strong> Department of Computer Science & Engineering<br />
            <strong>Courses:</strong> Full Stack Development (CSUL504) & DevOps Practices and Principles (CSUL511)
          </p>
        </section>
      </div>
    </main>
  );
}

export default About;