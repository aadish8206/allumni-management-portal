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

    // Validation
    if (!title || !description || targetAmount === undefined) {
      return res.status(400).json({ msg: 'title, description and targetAmount are required' });
    }
    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ msg: 'targetAmount must be a positive number' });
    }
    if (title.length > 150) return res.status(400).json({ msg: 'title too long (max 150 chars)' });
    if (description.length > 2000) return res.status(400).json({ msg: 'description too long (max 2000 chars)' });

    const campaign = new Campaign({
      title: title.trim(),
      description: description.trim(),
      targetAmount,
      deadline
    });
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Update campaign — whitelist fields to prevent mass assignment attack
router.put('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { title, description, targetAmount, deadline, status } = req.body;

    // Build safe update object — only whitelisted fields allowed
    const allowedUpdates = {};
    if (title !== undefined) {
      if (title.length > 150) return res.status(400).json({ msg: 'title too long (max 150 chars)' });
      allowedUpdates.title = title.trim();
    }
    if (description !== undefined) {
      if (description.length > 2000) return res.status(400).json({ msg: 'description too long (max 2000 chars)' });
      allowedUpdates.description = description.trim();
    }
    if (targetAmount !== undefined) {
      if (typeof targetAmount !== 'number' || targetAmount <= 0) {
        return res.status(400).json({ msg: 'targetAmount must be a positive number' });
      }
      allowedUpdates.targetAmount = targetAmount;
    }
    if (deadline !== undefined) allowedUpdates.deadline = deadline;
    if (status !== undefined) {
      if (!['active', 'completed'].includes(status)) {
        return res.status(400).json({ msg: 'status must be "active" or "completed"' });
      }
      allowedUpdates.status = status;
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      { returnDocument: 'after', runValidators: true }
    );
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });
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
