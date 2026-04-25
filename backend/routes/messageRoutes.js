const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content, attachedResumeId } = req.body;
    const sender = await User.findById(req.user.id).select('name');
    const receiver = await User.findById(receiverId).select('name email');
    
    const message = new Message({
      sender: req.user.id,
      senderName: sender.name,
      receiver: receiverId,
      receiverName: receiver ? receiver.name : undefined, // Optional, depending on schema, but good to have
      content,
      attachedResumeId
    });
    await message.save();

    // Send email notification
    const { sendEmail } = require('../services/emailService');
    if (receiver && receiver.email) {
      sendEmail(
        receiver.email,
        'New Message - Alumni Portal',
        `<p>Hi ${receiver.name},</p><p>You have received a new message from <b>${sender.name}</b>:</p><blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;"><i>"${content}"</i></blockquote><p>Please log in to your portal to reply.</p>`
      );
    }

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

// Edit message (Only sender)
router.put('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });
    if (message.sender.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    
    message.content = req.body.content;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete message (Sender or receiver)
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });
    if (message.sender.toString() !== req.user.id && message.receiver.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
