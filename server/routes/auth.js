const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
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

    if (!email.includes("@") || !email.includes(".")) {
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

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({ email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user,
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

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
});

module.exports = router;
