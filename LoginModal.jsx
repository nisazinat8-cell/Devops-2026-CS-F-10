import { useState } from "react";

function LoginModal({
  closeLogin,
  loginSuccess,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (
      cleanEmail === "" ||
      cleanPassword === ""
    ) {
      setMessage(
        "Please enter your email and password."
      );

      setMessageType("error");
      return;
    }

    if (
      !cleanEmail.includes("@") ||
      !cleanEmail.includes(".")
    ) {
      setMessage(
        "Please enter a valid email address."
      );

      setMessageType("error");
      return;
    }

    if (cleanPassword.length < 6) {
      setMessage(
        "Password must contain at least 6 characters."
      );

      setMessageType("error");
      return;
    }

    localStorage.setItem(
      "loggedInUser",
      cleanEmail
    );

    setMessage("Login successful!");
    setMessageType("success");

    setTimeout(function () {
      loginSuccess(cleanEmail);
      closeLogin();
    }, 1000);
  }

  function handleBackgroundClick(event) {
    if (event.target === event.currentTarget) {
      closeLogin();
    }
  }

  return (
    <div
      className="loginOverlay"
      onClick={handleBackgroundClick}
    >
      <div className="loginModal">
        <button
          type="button"
          className="closeButton"
          onClick={closeLogin}
        >
          &times;
        </button>

        <h2>Login</h2>

        <p>
          Login to your CareerConnect account
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="loginEmail">
            Email
          </label>

          <input
            type="email"
            id="loginEmail"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          <label htmlFor="loginPassword">
            Password
          </label>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            id="loginPassword"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          <label className="showPassword">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) =>
                setShowPassword(
                  event.target.checked
                )
              }
            />

            Show password
          </label>

          <button
            type="submit"
            className="submitLogin"
          >
            Login
          </button>

          {message && (
            <p
              className={`loginMessage ${messageType}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginModal;