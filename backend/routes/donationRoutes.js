const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Donation = require('../models/Donation');

const router = express.Router();

// Make a donation (alumni only)
router.post('/', [auth, checkRole(['alumni'])], async (req, res) => {
  try {
    const { amount, project, message } = req.body;

    // Validate amount — must be a positive number
    if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ msg: 'amount must be a positive number' });
    }
    // Cap at a reasonable max to prevent data corruption
    if (amount > 10000000) {
      return res.status(400).json({ msg: 'amount exceeds maximum allowed value' });
    }
    if (!project) return res.status(400).json({ msg: 'project is required' });
    if (message && message.length > 500) return res.status(400).json({ msg: 'message too long (max 500 chars)' });

    const User = require('../models/User');
    const donor = await User.findById(req.user.id).select('name');
    const donation = new Donation({
      donor: req.user.id,
      donorName: donor.name,
      amount,
      project,
      message
    });
    await donation.save();

    const Campaign = require('../models/Campaign');
    await Campaign.findOneAndUpdate({ title: project }, { $inc: { raisedAmount: amount } });

    res.json(donation);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all donations (admin only)
router.get('/', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get donation total per project
router.get('/stats', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $group: { _id: '$project', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
