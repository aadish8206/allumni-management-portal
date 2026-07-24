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

// CORS — allow configured frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parsing with size limit to prevent DoS
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumni_portal';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('[DATABASE] MongoDB Connected successfully to Atlas');
    const { initCronJobs } = require('./services/cronService');
    initCronJobs();
  })
  .catch((err) => {
    console.error('[DATABASE ERROR] MongoDB connection failed:', err.message);
  });

// Database Connection Guard Middleware for API routes
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    console.warn(`[API WARN] ${req.method} ${req.originalUrl} blocked: Database state is ${mongoose.connection.readyState}`);
    return res.status(503).json({
      msg: 'Database connection offline. Please ensure MongoDB Atlas IP Whitelist includes 0.0.0.0/0.'
    });
  }
  next();
});

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

// Basic route & Health Check
app.get('/', (req, res) => {
  res.send('Alumni Portal API is running');
});

app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    database: dbState,
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    hasSmtpUser: Boolean(process.env.SMTP_USER || process.env.EMAIL_USER),
    hasSmtpPass: Boolean(process.env.SMTP_PASS || process.env.EMAIL_PASS),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
