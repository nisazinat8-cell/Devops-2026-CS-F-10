import { useState } from "react";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("loggedInUser")
  );

  function handleLoginSuccess(email) {
    localStorage.setItem("loggedInUser", email);
    setLoggedInUser(email);
    setShowLogin(false);
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    alert("You have logged out successfully.");
  }

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="logo">
          CareerConnect
        </NavLink>

        <div className="navLinks">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            Jobs
          </NavLink>

          <NavLink
            to="/internships"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            Internships
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "activeLink" : ""
            }
          >
            About
          </NavLink>

          {loggedInUser ? (
            <button
              type="button"
              className="logoutButton"
              onClick={logout}
            >
              Logout
            </button>
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