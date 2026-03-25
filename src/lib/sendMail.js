import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // SSL on port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
}

/**
 * sendMail Utility
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 */
export default async function sendMail({ to, subject, text, html }) {
  if (!subject || (!text && !html)) {
    throw new Error("subject AND (text OR html) are required");
  }

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: to || process.env.TO_EMAIL,
    subject,
    text,
    html,
  };

  const info = await getTransporter().sendMail(mailOptions);
  return info;
}
