const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Habit = require('../models/Habit');
const User = require('../models/User'); // ✅ Needed for account deletion
const Task = require('../models/Task'); // ✅ Required for completed task routes

// ✅ POST - Create new habit
router.post('/', async (req, res) => {
  try {
    if (!req.body.username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const newHabit = new Habit(req.body);
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    console.error("❌ Error saving habit:", err);
    res.status(500).json({ error: "Failed to save habit" });
  }
});

// ✅ GET - Get habits by day/date and username
router.get('/', async (req, res) => {
  try {
    const { day, username, date } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    let filter = { username };
    if (day) filter.day = day;

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const habits = await Habit.find(filter);
    res.json(habits);
  } catch (err) {
    console.error("❌ Error fetching habits:", err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

// ✅ GET completed tasks by username
router.get('/tasks/completed/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const tasks = await Task.find({ username, status: 'completed' }).sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error fetching completed tasks:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PATCH completed status by ID
router.patch('/tasks/complete/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { status: 'completed' });
    res.json({ message: 'Task marked completed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark completed' });
  }
});

// ✅ GET a habit by ID with ObjectId validation
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.json(habit);
  } catch (err) {
    console.error("❌ Error fetching habit by ID:", err);
    res.status(500).json({ error: "Failed to fetch habit" });
  }
});

// ✅ PATCH - Update habit by ID
router.patch('/:id', async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.json(updatedHabit);
  } catch (err) {
    console.error("❌ Error updating habit:", err);
    res.status(500).json({ error: "Failed to update habit" });
  }
});

// ✅ DELETE - Delete habit by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // ✅ Check if ID is valid first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("❌ Invalid ID format:", id);
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deleted = await Habit.findOneAndDelete({ _id: id });

    if (!deleted) {
      console.log("⚠️ No document found with ID:", id);
      return res.status(404).json({ message: "Habit not found" });
    }

    console.log("🗑️ Deleted habit with ID:", id);
    res.json({ message: "Habit deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting habit:", err);
    res.status(500).json({ message: "Failed to delete habit" });
  }
});


// ✅ DELETE - Delete user + all their habits
router.delete('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const deletedUser = await User.deleteOne({ username });
    await Habit.deleteMany({ username });

    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account and all habits deleted" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;
