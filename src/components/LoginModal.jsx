import { useState } from "react";

function LoginModal({ closeLogin, loginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === "" || cleanPassword === "") {
      setMessage("Please enter both email and password.");
      setMessageType("error");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (cleanPassword.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const endpoint = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
        signal: AbortSignal.timeout(2500),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        localStorage.setItem("loggedInUser", cleanEmail);
        setMessage(isRegister ? "Account created successfully!" : "Login successful!");
        setMessageType("success");

        setTimeout(() => {
          loginSuccess(cleanEmail);
          closeLogin();
        }, 800);
        return;
      } else {
        setMessage(data.message || "Authentication failed.");
        setMessageType("error");
      }
    } catch (err) {
      // Graceful demo fallback if backend is offline
      localStorage.setItem("loggedInUser", cleanEmail);
      setMessage("Logged in (Demo Mode - backend offline).");
      setMessageType("success");

      setTimeout(() => {
        loginSuccess(cleanEmail);
        closeLogin();
      }, 800);
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackgroundClick(event) {
    if (event.target === event.currentTarget) {
      closeLogin();
    }
  }

  return (
    <div className="loginOverlay" onClick={handleBackgroundClick}>
      <div className="loginModal">
        <button
          type="button"
          className="closeButton"
          onClick={closeLogin}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="authTabs">
          <button
            type="button"
            className={`tabButton ${!isRegister ? "activeTab" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`tabButton ${isRegister ? "activeTab" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        <p className="authSubtitle">
          {isRegister
            ? "Create your CareerConnect student profile"
            : "Sign in to access your saved jobs & applications"}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="loginEmail">Email Address</label>
          <input
            type="email"
            id="loginEmail"
            placeholder="student@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
            required
          />

          <label htmlFor="loginPassword">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="loginPassword"
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
            required
          />

          <label className="showPassword">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Show password
          </label>

          <button type="submit" className="submitLogin" disabled={submitting}>
            {submitting ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>

          {message && (
            <p className={`loginMessage ${messageType}`}>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
