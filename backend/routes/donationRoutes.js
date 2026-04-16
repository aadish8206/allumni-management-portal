const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Donation = require('../models/Donation');

const router = express.Router();

// Make a donation (alumni only)
router.post('/', [auth, checkRole(['alumni'])], async (req, res) => {
  try {
    const { amount, project, message } = req.body;
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
