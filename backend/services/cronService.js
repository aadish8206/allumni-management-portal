const cron = require('node-cron');
const User = require('../models/User');
const { sendEmail } = require('./emailService');

const initCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    await performTransition();
  });

  // Also run once on server start for safety
  performTransition();
};

const performTransition = async () => {
  console.log('Running student-to-alumni role transition check...');
  try {
    const currentYear = new Date().getFullYear();
    
    // Find students whose graduationYear is less than or equal to current year
    const studentsToUpdate = await User.find({
      role: 'student',
      graduationYear: { $lte: currentYear, $ne: null }
    });

    if (studentsToUpdate.length > 0) {
      for (const student of studentsToUpdate) {
        student.role = 'alumni';
        await student.save();
        
        // Send congratulatory email
        await sendEmail(
          student.email,
          '🎓 Congratulations on your Graduation!',
          `<h1>Welcome to the Alumni Network, ${student.name}!</h1>
           <p>Based on your graduation year (${student.graduationYear}), your account has been automatically upgraded to <strong>Alumni</strong> status.</p>
           <p>You can now:</p>
           <ul>
             <li>Post job opportunities and referrals.</li>
             <li>Offer mentorship to current students.</li>
             <li>Sync your professional profile with LinkedIn.</li>
           </ul>
           <p>We are proud to have you as part of our alumni community!</p>`
        );
      }
      console.log(`Successfully transitioned ${studentsToUpdate.length} students to alumni.`);
    } else {
      console.log('No students found for transition.');
    }
  } catch (err) {
    console.error('Error in student-to-alumni role transition:', err);
  }
};

module.exports = { initCronJobs };
