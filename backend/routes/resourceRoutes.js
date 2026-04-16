const express = require('express');
const { auth, checkRole } = require('../middleware/authMiddleware');
const Resource = require('../models/Resource');

const router = express.Router();

// Admin posts a resource/announcement
router.post('/', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const { title, description, type, fileUrl } = req.body;
    const User = require('../models/User');
    const uploader = await User.findById(req.user.id).select('name');
    const resource = new Resource({
      title, description, type, fileUrl,
      uploadedBy: req.user.id,
      uploadedByName: uploader.name
    });
    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all resources (all authenticated users)
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) query.type = type;
    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete resource (admin only)
router.delete('/:id', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Resource deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
