const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const JobPost = require('../models/JobPost');

const router = express.Router();

// Create job/internship post (alumni only)
router.post('/', [auth, checkRole(['alumni'])], async (req, res) => {
  try {
    const { title, company, description, type, location, applyLink } = req.body;
    const job = new JobPost({
      title, company, description, type, location, applyLink,
      postedBy: req.user.id,
      postedByName: req.body.postedByName
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
    if (type) query.type = type;
    const jobs = await JobPost.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete job post
router.delete('/:id', [auth, checkRole(['alumni', 'admin'])], async (req, res) => {
  try {
    await JobPost.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Job post deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
