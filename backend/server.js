const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Security Headers (helmet)
app.use(helmet());

// HTTP Request Logging
app.use(morgan('combined'));

// CORS — only allow configured frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parsing with size limit to prevent DoS
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const eventRoutes = require('./routes/eventRoutes');
const messageRoutes = require('./routes/messageRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const donationRoutes = require('./routes/donationRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/campaigns', campaignRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumni_portal')
  .then(() => {
    console.log('MongoDB Connected successfully');
    // Initialize Cron Jobs
    const { initCronJobs } = require('./services/cronService');
    initCronJobs();
  })
  .catch((err) => console.log('MongoDB connection error:', err.message));

// Basic route
app.get('/', (req, res) => {
  res.send('Alumni Portal API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
