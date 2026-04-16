const mongoose = require('mongoose');

const JobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['internship', 'job', 'referral'], required: true },
  location: { type: String },
  applyLink: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedByName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('JobPost', JobPostSchema);
