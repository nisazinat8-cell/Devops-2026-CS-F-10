const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isDBConnected } = require("../config/db");

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "default_careerconnect_secret_key";

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// In-memory user store for demo/tests when Mongo is offline
const fallbackUsers = new Map();

function isValidEmail(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    if (isDBConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const user = await User.create({ email, password });
      const token = signToken(user._id);

      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        user: { _id: user._id, email: user.email },
      });
    }

    // Fallback in-memory
    if (fallbackUsers.has(email)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const mockId = "user_" + Date.now();
    fallbackUsers.set(email, { _id: mockId, email, password });
    const token = signToken(mockId);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: { _id: mockId, email },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not create account.",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    if (isDBConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const token = signToken(user._id);
      return res.json({
        success: true,
        message: "Login successful!",
        token,
        user: { _id: user._id, email: user.email },
      });
    }

    // Fallback mode
    const stored = fallbackUsers.get(email);
    if (stored && stored.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const mockId = stored ? stored._id : "demo_user_1";
    const token = signToken(mockId);

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: { _id: mockId, email },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
});

module.exports = router;
