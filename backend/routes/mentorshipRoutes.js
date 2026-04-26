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
    const mentorships = await Mentorship.find({ status: 'available' }).populate('mentor', 'skills location').sort({ createdAt: -1 });
    res.json(mentorships);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get my mentorships (as alumni or student)
router.get('/me', auth, async (req, res) => {
  try {
    const mentorships = await Mentorship.find({
      $or: [{ mentor: req.user.id }, { mentee: req.user.id }]
    })
    .populate('mentor', 'name email skills location')
    .populate('mentee', 'name email department batch')
    .sort({ updatedAt: -1 });
    
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
    ).populate('mentor', 'name email');
    
    // Send email notification
    const { sendEmail } = require('../services/emailService');
    if (mentorship.mentor && mentorship.mentor.email) {
      sendEmail(
        mentorship.mentor.email, 
        'New Mentorship Request - Alumni Portal', 
        `<p>Hi ${mentorship.mentor.name},</p><p>Great news! A student named <b>${mentee.name}</b> has requested your mentorship for your offered domain: <b>${mentorship.domain}</b>.</p><p>Please log in to the Alumni Portal to connect with them.</p>`
      );
    }

    res.json(mentorship);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
