const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Mentorship = require('../models/Mentorship');

const router = express.Router();

// Alumni offers mentorship
router.post('/', [auth, checkRole(['alumni'])], async (req, res) => {
  try {
    const { domain, description } = req.body;
    const User = require('../models/User');
    const mentor = await User.findById(req.user.id).select('name');
    const mentorship = new Mentorship({
      mentor: req.user.id,
      mentorName: mentor.name,
      domain,
      description
    });
    await mentorship.save();
    res.json(mentorship);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all available mentors (students + alumni can view)
router.get('/', [auth, checkRole(['student', 'alumni', 'admin'])], async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ status: 'available' }).sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Student requests mentorship slot
router.put('/:id/request', [auth, checkRole(['student'])], async (req, res) => {
  try {
    const User = require('../models/User');
    const mentee = await User.findById(req.user.id).select('name');
    const mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { mentee: req.user.id, menteeName: mentee.name, status: 'occupied' },
      { new: true }
    );
    res.json(mentorship);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
