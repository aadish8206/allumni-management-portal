const nodemailer = require('nodemailer');

// Configure this in .env or Render dashboard
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

console.log(`[EMAIL SERVICE] Initialized for: ${smtpUser}`);

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
      from: process.env.SMTP_FROM || `"Alumni Portal" <${process.env.SMTP_USER}>`,
      to,
      bcc,
      subject,
      html
    };

    // Send real email if credentials are provided
    if (smtpUser && smtpPass) {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.messageId);
      return true;
    } else {
      // Fallback for development if no credentials
      console.log('----------------------------------------------------');
      console.log(`[MOCK EMAIL LOG] Set SMTP_USER/PASS in .env for real emails`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('----------------------------------------------------');
      return true;
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendEmail };
