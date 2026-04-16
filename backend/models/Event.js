const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  type: { type: String, enum: ['reunion', 'seminar', 'workshop', 'other'], default: 'other' },
  organizedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizedByName: { type: String },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
