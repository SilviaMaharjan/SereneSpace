const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ✅ Import routes only ONCE
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');


const app = express();
const PORT = process.env.PORT || 5050;

// ✅ CORS Config
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
const taskRoutes = require('./routes/task');
app.use('/api/tasks', taskRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('🚀 SereneSpace Server is Running');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log("🌱 Habit Tracker App Started");
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
});
