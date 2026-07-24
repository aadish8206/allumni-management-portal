const cron = require('node-cron');
const User = require('../models/User');
const { sendEmail } = require('./emailService');

const initCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    await performTransition();
    await cleanupPastEvents();
  });

  // Also run once on server start for safety
  performTransition();
  cleanupPastEvents();
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

const cleanupPastEvents = async () => {
  console.log('Running automatic event cleanup...');
  try {
    const Event = require('../models/Event');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // 7-day grace period
    
    const result = await Event.deleteMany({ date: { $lt: cutoffDate } });
    if (result.deletedCount > 0) {
      console.log(`Automatically deleted ${result.deletedCount} events older than 7 days.`);
    }
  } catch (err) {
    console.error('Error in event cleanup:', err);
  }
};

module.exports = { initCronJobs };
