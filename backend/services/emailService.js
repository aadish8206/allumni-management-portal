const nodemailer = require('nodemailer');

// Configure this in .env for production
// VITE_SMTP_HOST, VITE_SMTP_PORT, VITE_SMTP_USER, VITE_SMTP_PASS
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'etherealpassword'
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Alumni Portal" <noreply@alumniportal.com>',
      to,
      subject,
      html
    };

    if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
      await transporter.sendMail(mailOptions);
    } else {
      // In development, just log the email to the console to prevent failing if SMTP is not configured
      console.log('----------------------------------------------------');
      console.log(`[MOCK EMAIL SENT]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${html}`);
      console.log('----------------------------------------------------');
    }
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendEmail };
