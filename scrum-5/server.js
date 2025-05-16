//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve HTML, CSS, JS from 'public' folder

// MongoDB Connection
mongoose.connect('mongodb+srv://habittrackingwebsite:12345@habittrackingwebsite-03.mwgey.mongodb.net/User')
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Routes
const authRoutes = require('./routes/auth'); // Make sure the path is correct
app.use('/api/auth', authRoutes);

// Serve HTML Pages on routes
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Server
const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
