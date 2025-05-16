const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve HTML, CSS, JS from 'public' folder

// MongoDB Connection
connectDB(); // This should now connect and print the log message

// Routes
const authRoutes = require('./routes/auth'); // Make sure the path is correct
app.use('/api/auth', authRoutes);

// Serve HTML Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Signup.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🌱 Habit Tracker App Started`);
  console.log(`✅ MongoDB connected`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
