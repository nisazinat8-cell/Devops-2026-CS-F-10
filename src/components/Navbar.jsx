import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(() => {
    return localStorage.getItem("loggedInUser");
  });

  function handleLoginSuccess(email) {
    setLoggedInUser(email);
  }

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setLoggedInUser(null);
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brandLink">
          <span className="brandIcon">💼</span>
          <span className="brandName">CareerConnect</span>
        </Link>

        <div className="navLinks">
          <Link to="/" className={location.pathname === "/" ? "activeNavLink" : ""}>
            Home
          </Link>
          <Link to="/jobs" className={location.pathname === "/jobs" ? "activeNavLink" : ""}>
            Jobs
          </Link>
          <Link to="/internships" className={location.pathname === "/internships" ? "activeNavLink" : ""}>
            Internships
          </Link>
          <Link to="/about" className={location.pathname === "/about" ? "activeNavLink" : ""}>
            About
          </Link>

          {loggedInUser ? (
            <div className="userProfileBadge">
              <span className="userEmail" title={loggedInUser}>
                👤 {loggedInUser}
              </span>
              <button
                type="button"
                className="logoutButton"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="loginButton"
              onClick={() => setShowLogin(true)}
            >
              Sign In
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
