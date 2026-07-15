const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: `"Customer Feedback System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
