const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['note', 'announcement', 'update'], default: 'note' },
  fileUrl: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedByName: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
