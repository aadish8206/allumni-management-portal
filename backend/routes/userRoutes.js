const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Helper to send alumni welcome email
const sendAlumniWelcomeEmail = async (user) => {
  try {
    await sendEmail({
      email: user.email,
      subject: '🎓 Congratulations on your Graduation!',
      message: `<h1>Welcome to the Alumni Network, ${user.name}!</h1>
                <p>Your account has been upgraded to <strong>Alumni</strong> status.</p>
                <p>You now have full access to alumni-only features like job referrals and mentorship offering.</p>`
    });
  } catch (err) {
    console.error('Failed to send alumni welcome email:', err);
  }
};

// Helper to automatically switch student to alumni
const checkAndSwitchRole = async (user) => {
  const currentYear = new Date().getFullYear();
  if (user.role === 'student' && user.graduationYear && currentYear >= user.graduationYear) {
    user.role = 'alumni';
    await user.save();
    await sendAlumniWelcomeEmail(user);
    return true;
  }
  return false;
};

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Check for automatic transition
    await checkAndSwitchRole(user);
    
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update current user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, batch, department, company, jobTitle, bio, phone, linkedin, resumeBase64, resumeFileName, location, skills, graduationYear } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update basic fields
    const updates = { name, batch, department, company, jobTitle, bio, phone, linkedin, resumeBase64, resumeFileName, location, skills };
    
    // Logic for graduationYear (Pass out Year)
    // Student can only fill it once (if it's not already set)
    if (graduationYear !== undefined) {
      if (req.user.role === 'admin') {
        updates.graduationYear = graduationYear;
      } else if (!user.graduationYear) {
        updates.graduationYear = graduationYear;
      }
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();
    
    // Check if the update triggers a role switch
    await checkAndSwitchRole(user);

    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
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
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { returnDocument: 'after' }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Update user details
router.put('/admin/users/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { name, email, role, batch, department, graduationYear, isVerified } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const oldRole = user.role;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (batch) user.batch = batch;
    if (department) user.department = department;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();
    
    // Check for manual switch or automatic switch
    const switchedAutomatically = await checkAndSwitchRole(user);
    
    // If not switched automatically but role changed from student to alumni manually
    if (!switchedAutomatically && oldRole === 'student' && user.role === 'alumni') {
      await sendAlumniWelcomeEmail(user);
    }

    const updatedUser = await User.findById(req.params.id).select('-password');
    res.json(updatedUser);
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
    let query = { role: 'alumni', isVerified: { $ne: false } };
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
    const verifiedAlumni = await User.countDocuments({ role: 'alumni', isVerified: { $ne: false } });
    const pendingVerification = await User.countDocuments({ isVerified: false, role: { $ne: 'admin' } });
    res.json({ totalAlumni, totalStudents, verifiedAlumni, pendingVerification });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN & ALUMNI: Get student's resume
router.get('/resume/:id', [auth, checkRole(['admin', 'alumni'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('resumeBase64 resumeFileName');
    if (!user || !user.resumeBase64) return res.status(404).json({ msg: 'Resume not found' });
    res.json({ resumeBase64: user.resumeBase64, resumeFileName: user.resumeFileName });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ADMIN: Delete student's resume
router.delete('/admin/resume/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $unset: { resumeBase64: "", resumeFileName: "" } });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
