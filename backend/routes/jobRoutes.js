const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const JobPost = require('../models/JobPost');

const router = express.Router();

// Create job/internship post (alumni only)
router.post('/', [auth, checkRole(['alumni'])], async (req, res) => {
  try {
    const { title, company, description, type, location, applyLink } = req.body;

    // Validation
    if (!title || !company || !description || !type) {
      return res.status(400).json({ msg: 'title, company, description, and type are required' });
    }
    if (!['internship', 'job', 'referral'].includes(type)) {
      return res.status(400).json({ msg: 'type must be internship, job, or referral' });
    }
    if (title.length > 150) return res.status(400).json({ msg: 'title too long (max 150 chars)' });
    if (description.length > 3000) return res.status(400).json({ msg: 'description too long (max 3000 chars)' });

    // Fetch poster name from DB — do NOT trust client-sent name
    const User = require('../models/User');
    const poster = await User.findById(req.user.id).select('name');

    const job = new JobPost({
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      type,
      location: location ? location.trim() : undefined,
      applyLink: applyLink ? applyLink.trim() : undefined,
      postedBy: req.user.id,
      postedByName: poster.name  // Always from DB, never from req.body
    });
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all jobs (students, alumni, admin can view)
router.get('/', [auth, checkRole(['student', 'alumni', 'admin'])], async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      if (!['internship', 'job', 'referral'].includes(type)) {
        return res.status(400).json({ msg: 'Invalid type filter' });
      }
      query.type = type;
    }
    const jobs = await JobPost.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete job post — ownership check: only the original poster or admin can delete
router.delete('/:id', [auth, checkRole(['alumni', 'admin'])], async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job post not found' });

    // Only original poster or admin can delete
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: You can only delete your own job posts' });
    }

    await JobPost.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Job post deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
