const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Campaign = require('../models/Campaign');

const router = express.Router();

// Get all active campaigns
router.get('/', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Create a new campaign
router.post('/', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { title, description, targetAmount, deadline } = req.body;
    const campaign = new Campaign({
      title,
      description,
      targetAmount,
      deadline
    });
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Update campaign status or details
router.put('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(campaign);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Delete campaign
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Campaign deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
