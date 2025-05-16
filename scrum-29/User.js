const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  deactivated: { type: Boolean, default: false }  // ✅ Add this line
});

module.exports = mongoose.model('User', userSchema);
