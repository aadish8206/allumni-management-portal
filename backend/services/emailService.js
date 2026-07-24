const nodemailer = require('nodemailer');

const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

console.log(`[EMAIL SERVICE] Initialized for: ${smtpUser ? smtpUser : 'NO SMTP USER SPECIFIED'}`);

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} bcc - Optional BCC recipients (array or string)
 */
const sendEmail = async (to, subject, html, bcc = null) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Alumni Portal" <${smtpUser}>`,
      to,
      bcc,
      subject,
      html
    };

    if (smtpUser && smtpPass && smtpPass !== 'your_app_password_here') {
      const info = await transporter.sendMail(mailOptions);
      console.log('[EMAIL SERVICE] Email sent successfully:', info.messageId);
      return true;
    } else {
      console.log('----------------------------------------------------');
      console.log(`[MOCK EMAIL LOG] Set valid SMTP_USER/SMTP_PASS in .env for real emails`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('----------------------------------------------------');
      return true;
    }
  } catch (error) {
    console.error('[EMAIL SERVICE ERROR] Email sending failed:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };
