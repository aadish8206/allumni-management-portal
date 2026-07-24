const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Helper: strip HTML tags to prevent HTML injection in emails
const stripHtml = (str) => String(str).replace(/<[^>]*>/g, '').trim();

// Create event (alumni or admin)
router.post('/', [auth, checkRole(['alumni', 'admin'])], async (req, res) => {
  try {
    const { title, description, date, location, type } = req.body;

    // Validation
    if (!title || !description || !date || !type) {
      return res.status(400).json({ msg: 'title, description, date, and type are required' });
    }
    if (title.length > 200) return res.status(400).json({ msg: 'title too long (max 200 chars)' });
    if (description.length > 3000) return res.status(400).json({ msg: 'description too long (max 3000 chars)' });
    if (isNaN(Date.parse(date))) return res.status(400).json({ msg: 'Invalid date format' });

    // Fetch organizer name from DB — do NOT trust client-sent name
    const organizer = await User.findById(req.user.id).select('name');

    // Sanitize all user-supplied content before storing and emailing
    const safeTitle = stripHtml(title);
    const safeDescription = stripHtml(description);
    const safeLocation = location ? stripHtml(location) : 'TBA';

    const event = new Event({
      title: safeTitle,
      description: safeDescription,
      date,
      location: safeLocation,
      type,
      organizedBy: req.user.id,
      organizedByName: organizer.name,  // Always from DB
      attendees: [req.user.id]
    });
    await event.save();

    // Fetch all students and admins
    const users = await User.find({ role: { $in: ['student', 'admin'] } }).select('email');
    const emails = users.map(u => u.email).filter(e => e);

    if (emails.length > 0) {
      const message = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">New Event Announcement!</h2>
          <p>A new event has just been organized by <strong>${organizer.name}</strong>.</p>
          <div style="background: #f9fafb; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${safeTitle}</h3>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
            <p><strong>Location:</strong> ${safeLocation}</p>
            <p><strong>Details:</strong> ${safeDescription}</p>
          </div>
          <p>Log in to your portal to RSVP!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Go to Portal</a>
        </div>
      `;

      // Send emails asynchronously via BCC so users don't see each other's addresses
      sendEmail({
        email: process.env.SMTP_USER,
        bcc: emails,
        subject: `New Announcement: ${safeTitle}`,
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

// Delete event — ownership check: only the organizer or admin can delete
router.delete('/:id', [auth, checkRole(['alumni', 'admin'])], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Only original organizer or admin can delete
    if (event.organizedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: You can only delete your own events' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
