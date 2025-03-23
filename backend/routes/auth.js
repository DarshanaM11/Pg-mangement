const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user exists
    const user = await User.findOne({ username, password, role });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
