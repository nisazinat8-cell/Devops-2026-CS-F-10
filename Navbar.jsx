import { useState } from "react";
import LoginModal from "./LoginModal";

function Navbar() {
  const [showLogin, setShowLogin] =
    useState(false);

  const [loggedInUser, setLoggedInUser] =
    useState(
      localStorage.getItem("loggedInUser")
    );

  function handleLoginSuccess(email) {
    setLoggedInUser(email);
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);

    alert("You have logged out successfully.");
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
            <button
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
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