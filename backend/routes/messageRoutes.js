const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Helper: strip HTML tags to prevent injection in emails
const stripHtml = (str) => String(str).replace(/<[^>]*>/g, '').trim();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content, attachedResumeId } = req.body;

    // Validation
    if (!receiverId || !content) {
      return res.status(400).json({ msg: 'receiverId and content are required' });
    }
    if (content.length > 2000) return res.status(400).json({ msg: 'Message too long (max 2000 chars)' });

    const sender = await User.findById(req.user.id).select('name role');
    const receiver = await User.findById(receiverId).select('name email role');

    if (!receiver) return res.status(404).json({ msg: 'Receiver not found' });

    // Prevent messaging yourself
    if (req.user.id === receiverId) {
      return res.status(400).json({ msg: 'You cannot send a message to yourself' });
    }

    // Restriction: Student <-> Alumni messaging only if approved mentorship exists
    if ((sender.role === 'student' && receiver.role === 'alumni') ||
        (sender.role === 'alumni' && receiver.role === 'student')) {

      const Mentorship = require('../models/Mentorship');
      const mentorship = await Mentorship.findOne({
        $or: [
          { mentor: sender._id, mentee: receiver._id },
          { mentor: receiver._id, mentee: sender._id }
        ],
        status: 'approved'
      });

      if (!mentorship && sender.role !== 'admin') {
        return res.status(403).json({ msg: 'Contact not allowed. Mentorship must be approved by admin first.' });
      }
    }

    const message = new Message({
      sender: req.user.id,
      senderName: sender.name,
      receiver: receiverId,
      receiverName: receiver.name,
      content,
      attachedResumeId
    });
    await message.save();

    // Sanitize before embedding in email HTML — prevent HTML injection
    const safeContent = stripHtml(content);
    const safeSenderName = stripHtml(sender.name);

    const { sendEmail } = require('../services/emailService');
    if (receiver && receiver.email) {
      sendEmail(
        receiver.email,
        'New Message - Alumni Portal',
        `<p>Hi ${stripHtml(receiver.name)},</p>
         <p>You have received a new message from <b>${safeSenderName}</b>:</p>
         <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
           <i>"${safeContent}"</i>
         </blockquote>
         <p>Please log in to your portal to reply.</p>`
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

// Mark as read — only the receiver can mark their own messages
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });

    // Only the intended receiver can mark as read
    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied: You can only mark your own messages as read' });
    }

    message.read = true;
    await message.save();
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
    if (message.sender.toString() !== req.user.id) return res.status(403).json({ msg: 'Access denied: Not your message' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: 'content is required' });
    if (content.length > 2000) return res.status(400).json({ msg: 'Message too long (max 2000 chars)' });

    message.content = content;
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
      return res.status(403).json({ msg: 'Access denied: Not your message' });
    }
    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
