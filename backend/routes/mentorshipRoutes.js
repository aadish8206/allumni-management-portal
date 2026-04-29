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

// Student requests mentorship slot (now goes to pending approval)
router.put('/:id/request', [auth, checkRole(['student'])], async (req, res) => {
  try {
    const User = require('../models/User');
    const mentee = await User.findById(req.user.id).select('name');
    const mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { mentee: req.user.id, menteeName: mentee.name, status: 'pending_approval' },
      { new: true }
    ).populate('mentor', 'name email');
    
    // Notification for Admin (optional: could also send email to admin)
    res.json({ msg: 'Mentorship request sent for admin approval', mentorship });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Get all pending mentorship requests
router.get('/admin/requests', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const requests = await Mentorship.find({ status: 'pending_approval' })
      .populate('mentor', 'name email department batch')
      .populate('mentee', 'name email department batch')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Approve mentorship request
router.put('/admin/approve/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('mentor', 'name email').populate('mentee', 'name email');

    // Notify mentor and mentee
    const { sendEmail } = require('../services/emailService');
    if (mentorship.mentor && mentorship.mentor.email) {
      sendEmail(mentorship.mentor.email, 'Mentorship Approved', `<p>The mentorship request from ${mentorship.mentee.name} has been approved by admin.</p>`);
    }
    if (mentorship.mentee && mentorship.mentee.email) {
      sendEmail(mentorship.mentee.email, 'Mentorship Request Approved', `<p>Your mentorship request to ${mentorship.mentor.name} has been approved. You can now contact them.</p>`);
    }

    res.json(mentorship);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Reject mentorship request
router.put('/admin/reject/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { adminNote } = req.body;
    const mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      { status: 'available', mentee: null, menteeName: null, adminNote },
      { new: true }
    ).populate('mentee', 'email name');

    if (mentorship.mentee && mentorship.mentee.email) {
      const { sendEmail } = require('../services/emailService');
      sendEmail(mentorship.mentee.email, 'Mentorship Request Update', `<p>Your mentorship request was not approved. Admin Note: ${adminNote}</p>`);
    }

    res.json({ msg: 'Request rejected', mentorship });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
