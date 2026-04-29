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
  console.log('Running autonomous student-to-alumni transition check...');
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    
    // Find all students who have a graduation year set
    const studentsToUpdate = await User.find({
      role: 'student',
      graduationYear: { $exists: true, $ne: null, $lte: currentYear }
    });

    const standardPassoutMonth = 6; // June

    if (studentsToUpdate.length > 0) {
      let count = 0;
      for (const student of studentsToUpdate) {
        // Skip if it's the current year but we haven't reached June yet
        if (student.graduationYear === currentYear && currentMonth < standardPassoutMonth) {
          continue;
        }

        student.role = 'alumni';
        await student.save();
        count++;
        
        // Send congratulatory email
        await sendEmail(
          student.email,
          '🎓 Congratulations on your Graduation!',
          `<h1>Welcome to the Alumni Network, ${student.name}!</h1>
           <p>Your account has been automatically upgraded to <strong>Alumni</strong> status following your graduation year (${student.graduationYear}).</p>
           <p>You now have full access to alumni-only features like job referrals and mentorship offering.</p>`
        );
      }
      if (count > 0) console.log(`Successfully transitioned ${count} students to alumni.`);
    }
  } catch (err) {
    console.error('Error in autonomous transition:', err);
  }
};

module.exports = { initCronJobs };
