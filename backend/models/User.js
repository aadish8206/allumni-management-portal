const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student', 'alumni'], required: true },
  batch: { type: String },
  department: { type: String },
  graduationYear: { type: Number }, // To track when they become alumni
  // Professional profile fields (mainly for alumni)
  company: { type: String },
  jobTitle: { type: String },
  bio: { type: String },
  phone: { type: String },
  linkedin: { type: String },
  lastLinkedInSync: { type: Date },
  location: { type: String },
  skills: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resumeBase64: { type: String },
  resumeFileName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
