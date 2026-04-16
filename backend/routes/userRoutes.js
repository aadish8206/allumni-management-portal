const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update current user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, batch, department, company, jobTitle, bio, phone, linkedin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, batch, department, company, jobTitle, bio, phone, linkedin } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Get all users
router.get('/admin/users', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Verify a user
router.put('/admin/verify/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Delete a user
router.delete('/admin/users/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get alumni directory (for students + alumni + admin)
router.get('/directory', [auth, checkRole(['student', 'alumni', 'admin'])], async (req, res) => {
  try {
    const { batch, department } = req.query;
    let query = { role: 'alumni', isVerified: true };
    if (batch) query.batch = batch;
    if (department) query.department = department;
    const alumni = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(alumni);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all students (for alumni to message)
router.get('/students', [auth, checkRole(['alumni', 'admin'])], async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Get stats for dashboard
router.get('/admin/stats', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const verifiedAlumni = await User.countDocuments({ role: 'alumni', isVerified: true });
    const pendingVerification = await User.countDocuments({ isVerified: false, role: { $ne: 'admin' } });
    res.json({ totalAlumni, totalStudents, verifiedAlumni, pendingVerification });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
