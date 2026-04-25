const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');
const Campaign = require('./models/Campaign');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find an admin user to be the uploader
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Please register an admin account first.');
      process.exit(1);
    }

    // Sample Campus Updates & Study Notes (Resources)
    const sampleResources = [
      {
        title: 'Complete DS & Algo Roadmap 2024',
        description: 'Comprehensive guide covering Arrays to Graphs with practice problems.',
        type: 'note',
        uploadedBy: admin._id,
        uploadedByName: admin.name
      },
      {
        title: 'New Innovation Lab Opening',
        description: 'The new AI/ML Research Lab will be inaugurated this Friday at 10 AM.',
        type: 'update',
        uploadedBy: admin._id,
        uploadedByName: admin.name
      },
      {
        title: 'NBA Accreditation Success!',
        description: 'Our department has successfully received NBA accreditation for the next 3 years.',
        type: 'announcement',
        uploadedBy: admin._id,
        uploadedByName: admin.name
      }
    ];

    // Sample Fundraising Campaigns
    const sampleCampaigns = [
      {
        title: 'Library Digital Transformation',
        description: 'Digitizing 5,000+ rare engineering journals and adding high-speed e-book terminals.',
        targetAmount: 50000,
        raisedAmount: 12500,
        status: 'active',
        endDate: new Date('2024-12-31')
      },
      {
        title: 'Scholarship Fund 2025',
        description: 'Supporting 10 deserving students from economically weaker sections for their final year fees.',
        targetAmount: 100000,
        raisedAmount: 45000,
        status: 'active',
        endDate: new Date('2025-06-30')
      }
    ];

    await Resource.insertMany(sampleResources);
    await Campaign.insertMany(sampleCampaigns);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
