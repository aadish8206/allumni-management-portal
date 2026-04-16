const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Event = require('../models/Event');

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
