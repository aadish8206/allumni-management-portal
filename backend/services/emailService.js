const nodemailer = require('nodemailer');

/**
 * Creates a fresh nodemailer transporter using current env vars.
 * Called lazily per-send so env vars are always fully loaded.
 */
const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  // Strip spaces from Gmail App Password (Google shows it with spaces, but it must be sent without)
  const smtpPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s/g, '');

  return {
    transporter: nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS via STARTTLS
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    }),
    smtpUser,
    smtpPass
  };
};

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string|string[]} bcc - Optional BCC recipients (array or string)
 */
const sendEmail = async (to, subject, html, bcc = null) => {
  const { transporter, smtpUser, smtpPass } = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Alumni Portal" <${smtpUser}>`,
    to,
    subject,
    html
  };

  // Only include bcc if it actually has content
  if (bcc && (Array.isArray(bcc) ? bcc.length > 0 : bcc.trim())) {
    mailOptions.bcc = bcc;
  }

  if (smtpUser && smtpPass && smtpPass !== 'your_app_password_here') {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('[EMAIL SERVICE] Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('[EMAIL SERVICE ERROR] Email sending failed:', error.message);
      console.error('[EMAIL SERVICE ERROR] SMTP User:', smtpUser);
      console.error('[EMAIL SERVICE ERROR] Full error:', error);
      throw error;
    }
  } else {
    console.log('----------------------------------------------------');
    console.log('[MOCK EMAIL LOG] No valid SMTP credentials — set SMTP_USER and SMTP_PASS in .env');
    console.log(`To: ${to}`);
    if (bcc) console.log(`Bcc: ${Array.isArray(bcc) ? bcc.join(', ') : bcc}`);
    console.log(`Subject: ${subject}`);
    console.log('----------------------------------------------------');
    return true;
  }
};

module.exports = { sendEmail };
