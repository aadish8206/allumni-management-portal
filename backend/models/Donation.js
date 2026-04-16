const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName: { type: String },
  amount: { type: Number, required: true },
  project: { type: String, required: true },
  message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
