const mongoose = require('mongoose');

const MentorshipSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorName: { type: String },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  menteeName: { type: String },
  domain: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('Mentorship', MentorshipSchema);
