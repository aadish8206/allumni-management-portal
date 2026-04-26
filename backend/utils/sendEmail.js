const { sendEmail: serviceSendEmail } = require('../services/emailService');

/**
 * Compatibility wrapper for the original sendEmail utility
 * @param {Object} options - Email options { email, subject, message, bcc }
 */
const sendEmail = async (options) => {
  return await serviceSendEmail(
    options.email,
    options.subject,
    options.message,
    options.bcc
  );
};

module.exports = sendEmail;
