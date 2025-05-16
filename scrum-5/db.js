// db.js
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // MongoDB URI from .env
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit if MongoDB connection fails
  }
};

module.exports = connectDB; // Export the connectDB function
