const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Habit = require('../models/Habit'); // Needed for account deletion


// 🔐 Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📄 Get user profile
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Change Password
router.patch('/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== currentPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
});


/// PATCH /api/auth/deactivate/:username
router.patch('/deactivate/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOneAndUpdate(
      { username },
      { deactivated: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "✅ User successfully deactivated." });
  } catch (err) {
    console.error("❌ Error deactivating user:", err);
    res.status(500).json({ message: "Server error during deactivation" });
  }
});

module.exports = router;
