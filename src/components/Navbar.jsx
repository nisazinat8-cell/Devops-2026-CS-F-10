import { useState } from "react";
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
          <a href="#home">Home</a>
          <a href="#jobs">Jobs</a>
          <a href="#jobs">Internships</a>
          <a href="#about">About</a>

          {loggedInUser ? (
            <>
              <span className="userEmail">
                {loggedInUser}
              </span>

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