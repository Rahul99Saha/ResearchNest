const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student','faculty','admin'],required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);