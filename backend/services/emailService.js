const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error);
  } else {
    console.log("Brevo SMTP Server is ready");
  }
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
