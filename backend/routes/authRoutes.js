const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter: max 10 auth attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { msg: 'Too many attempts from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Register Route
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, role, batch, department } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    // Name validation
    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ msg: 'Name must be between 2 and 100 characters' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please enter a valid email address' });
    }

    // Password strength: minimum 8 chars, at least one letter and one number
    if (password.length < 8) {
      return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ msg: 'Password must contain at least one letter and one number' });
    }

    // Role validation
    if (!['student', 'alumni'].includes(role)) {
      return res.status(400).json({ msg: 'Role must be student or alumni' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check for existing user
    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
      batch: batch ? batch.trim() : undefined,
      department: department ? department.trim() : undefined
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Registration failed due to a server error. Please try again.' });
  }
});

// Login Route
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: 'Please provide an email address' });
    }

    // Case-insensitive email query
    const user = await User.findOne({ email: new RegExp('^' + email.trim() + '$', 'i') });
    if (!user) {
      return res.status(404).json({ msg: 'No registered account was found with that email address.' });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">🎓 Alumni Portal — Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset for your account.</p>
        <p>Please click the button below to reset your password. This link is valid for <strong>10 minutes</strong>.</p>
        <a href="${resetUrl}" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: 600;">Reset My Password</a>
        <p style="color: #64748b; font-size: 0.875rem;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: '🎓 Alumni Portal - Password Reset',
        message
      });

      res.status(200).json({ msg: 'Password reset link sent to your email.' });
    } catch (err) {
      console.error('Password reset email send error:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ msg: 'Email server authentication failed. Please check SMTP configuration.' });
    }
  } catch (err) {
    console.error('Forgot password internal error:', err);
    res.status(500).json({ msg: 'Server Error. Please try again later.' });
  }
});

// Reset Password Route
router.put('/reset-password/:token', async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

