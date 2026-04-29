const cron = require('node-cron');
const User = require('../models/User');

const initCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily student-to-alumni role transition check...');
    try {
      const currentYear = new Date().getFullYear();
      
      // Find students whose graduationYear is less than or equal to current year
      const studentsToUpdate = await User.find({
        role: 'student',
        graduationYear: { $lte: currentYear, $ne: null }
      });

      if (studentsToUpdate.length > 0) {
        const result = await User.updateMany(
          {
            _id: { $in: studentsToUpdate.map(u => u._id) }
          },
          {
            $set: { role: 'alumni' }
          }
        );
        console.log(`Successfully transitioned ${result.modifiedCount} students to alumni.`);
      } else {
        console.log('No students found for transition.');
      }
    } catch (err) {
      console.error('Error in student-to-alumni cron job:', err);
    }
  });
};

module.exports = initCronJobs;
