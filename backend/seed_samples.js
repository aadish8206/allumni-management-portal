const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');
const Campaign = require('./models/Campaign');
const User = require('./models/User');

dotenv.config();

// Small dummy PDF base64 string
const dummyPdf = 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+IGVuZG9iagoyIDAgb2JqIDw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDMgMCBSIF0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmogPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9Db250ZW50cyA0IDAgUiA+PiBlbmRvYmoKNCAwIG9i <lines_truncated> ';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Please register an admin account first.');
      process.exit(1);
    }

    // Clear existing samples first to avoid duplicates
    await Resource.deleteMany({ uploadedByName: admin.name });

    const sampleResources = [
      {
        title: 'Complete DS & Algo Roadmap 2024',
        description: 'Comprehensive guide covering Arrays to Graphs with practice problems.',
        type: 'note',
        uploadedBy: admin._id,
        uploadedByName: admin.name,
        fileUrl: dummyPdf // Added dummy file
      },
      {
        title: 'New Innovation Lab Opening',
        description: 'The new AI/ML Research Lab will be inaugurated this Friday at 10 AM.',
        type: 'update',
        uploadedBy: admin._id,
        uploadedByName: admin.name,
        fileUrl: dummyPdf // Added dummy file
      },
      {
        title: 'Annual Alumni Meet 2024 Agenda',
        description: 'Download the full schedule and session details for the upcoming meet.',
        type: 'announcement',
        uploadedBy: admin._id,
        uploadedByName: admin.name,
        fileUrl: dummyPdf // Added dummy file
      }
    ];

    await Resource.insertMany(sampleResources);
    console.log('Sample data with file attachments seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
