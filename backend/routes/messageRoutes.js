const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const sender = await User.findById(req.user.id).select('name');
    const message = new Message({
      sender: req.user.id,
      senderName: sender.name,
      receiver: receiverId,
      content
    });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get inbox messages (messages received by current user)
router.get('/inbox', auth, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get sent messages
router.get('/sent', auth, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ msg: 'Marked as read' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
