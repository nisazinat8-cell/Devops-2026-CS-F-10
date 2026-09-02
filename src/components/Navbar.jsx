import { useState } from "react";
import { Link } from "react-router-dom"; 
import LoginModal from "./LoginModal";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    return localStorage.getItem("loggedInUser");
  });

  function handleLoginSuccess(email) {
    localStorage.setItem("loggedInUser", email);
    setLoggedInUser(email);
  }

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    alert("Logged out successfully.");
  }

  return (
    <>
      <nav className="navbar">
        <h2>CareerConnect</h2>
        <div className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/internships">Internships</Link>
          <Link to="/about">About</Link>

          {loggedInUser ? (
            <>
              <span className="userEmail">{loggedInUser}</span>
              <button
                type="button"
                className="logoutButton"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="loginButton"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {showLogin && (
        <LoginModal
          closeLogin={() => setShowLogin(false)}
          loginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}

export default Navbar;
