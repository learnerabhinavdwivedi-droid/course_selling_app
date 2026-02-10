const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('../config/env');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
});

async function sendEnrollmentEmail(to, courseTitle) {
  if (!SMTP_HOST) {
    logger.warn('SMTP not configured; skipping enrollment email');
    return;
  }

  await transporter.sendMail({
    from: SMTP_USER,
    to,
    subject: `Enrollment confirmed: ${courseTitle}`,
    text: `You are enrolled in ${courseTitle}. Happy learning!`
  });
}

module.exports = { sendEnrollmentEmail };
