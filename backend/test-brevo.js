const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
});

async function test() {
  try {
    await transporter.verify();
    console.log("✅ Connected to Brevo successfully");
  } catch (err) {
    console.error("❌ Verify failed:");
    console.error(err);
  }
}

test();
