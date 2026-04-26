const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');
const Campaign = require('./models/Campaign');
const User = require('./models/User');

dotenv.config();

// Valid 1-page minimal PDF
const validPdf = 'data:application/pdf;base64,JVBERi0xLjEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgo3MiA3MDIgVGQKKEFsdW1uaSBQb3J0YWwgU2FtcGxlIERvY3VtZW50KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxMzggMDAwMDAgbiAKMDAwMDAwMDMwMSAwMDAwMCBuIAowMDAwMDAwMzc5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDc0CiUlRU9G';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Please register an admin account first.');
      process.exit(1);
    }

    await Resource.deleteMany({ uploadedByName: admin.name });

    const sampleResources = [
      {
        title: 'Complete DS & Algo Roadmap 2024',
        description: 'Comprehensive guide covering Arrays to Graphs with practice problems.',
        type: 'note',
        uploadedBy: admin._id,
        uploadedByName: admin.name,
        fileUrl: validPdf
      },
      {
        title: 'New Innovation Lab Opening',
        description: 'The new AI/ML Research Lab will be inaugurated this Friday at 10 AM.',
        type: 'update',
        uploadedBy: admin._id,
        uploadedByName: admin.name,
        fileUrl: validPdf
      },
      {
        title: 'Annual Alumni Meet 2024 Agenda',
        description: 'Download the full schedule and session details for the upcoming meet.',
        type: 'announcement',
        uploadedBy: admin._id,
        uploadedByName: admin.name,
        fileUrl: validPdf
      }
    ];

    await Resource.insertMany(sampleResources);
    console.log('Sample data with VALID PDF attachments seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
