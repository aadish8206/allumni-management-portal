const nodemailer = require('nodemailer');

// Configure this in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
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
