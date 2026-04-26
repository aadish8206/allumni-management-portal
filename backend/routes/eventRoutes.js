const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Create event (alumni or admin)
router.post('/', [auth, checkRole(['alumni', 'admin'])], async (req, res) => {
  try {
    const { title, description, date, location, type } = req.body;
    const event = new Event({
      title, description, date, location, type,
      organizedBy: req.user.id,
      organizedByName: req.body.organizedByName,
      attendees: [req.user.id]
    });
    await event.save();

    // Fetch all students and admins
    const users = await User.find({ role: { $in: ['student', 'admin'] } }).select('email');
    const emails = users.map(u => u.email).filter(e => e); // ensure valid emails

    if (emails.length > 0) {
      const message = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">New Event Announcement!</h2>
          <p>A new event has just been organized by <strong>${req.body.organizedByName || 'an Alumni'}</strong>.</p>
          <div style="background: #f9fafb; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${title}</h3>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
            <p><strong>Location:</strong> ${location || 'TBA'}</p>
            <p><strong>Details:</strong> ${description}</p>
          </div>
          <p>Log in to your portal to RSVP!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Go to Portal</a>
        </div>
      `;

      // Send emails asynchronously via BCC so users don't see each other's addresses
      sendEmail({
        email: process.env.SMTP_USER, // Send to self
        bcc: emails,                   // BCC all students and admins
        subject: `New Announcement: ${title}`,
        message
      }).catch(err => console.error('Failed to send announcement emails:', err));
    }

    res.json(event);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all events (all logged-in users)
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// RSVP an event (attend)
router.put('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    if (!event.attendees.includes(req.user.id)) {
      event.attendees.push(req.user.id);
      await event.save();
    }
    res.json(event);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete event
router.delete('/:id', [auth, checkRole(['alumni', 'admin'])], async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
