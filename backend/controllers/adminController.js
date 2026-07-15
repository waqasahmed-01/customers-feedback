const Feedback = require("../models/Feedback");
const crypto = require("crypto");
const Customer = require("../models/Customer");
const FeedbackInvitation = require("../models/FeedbackInvitation");
const { sendFeedbackSchema } = require("../validators/customerValidator");
const sendEmail = require("../services/emailService");
const jwt = require("jsonwebtoken");
const { loginAdminSchema } = require("../validators/adminValidator");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const { registerAdminSchema } = require("../validators/adminValidator");

const registerAdmin = async (req, res) => {
  try {
    const { error } = registerAdminSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const adminExists = await Admin.findOne();

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists.",
      });
    }

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { error } = loginAdminSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//Sending test email to check if email service is working.
const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    await sendEmail({
      to: email,
      subject: "Customer Feedback System",
      html: `
        <h2>Email Service Working</h2>
        <p>This email was sent successfully using Nodemailer.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Sending feedback invitation to customer.
const sendFeedbackInvitation = async (req, res) => {
  try {
    const { error } = sendFeedbackSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email } = req.body;

    let customer = await Customer.findOne({ email });

    if (!customer) {
      customer = await Customer.create({
        name,
        email,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitation = await FeedbackInvitation.create({
      customer: customer._id,
      token,
      expiresAt,
    });

    const feedbackLink = `${process.env.FRONTEND_URL}/feedback.html?token=${token}`;

    await sendEmail({
      to: customer.email,
      subject: "We Value Your Feedback",
      html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <h2>Customer Feedback Request</h2>

      <p>Hello <strong>${customer.name}</strong>,</p>

      <p>
        Thank you for choosing our service.
        We would appreciate your feedback.
      </p>

      <p style="text-align:center; margin:30px 0;">
        <a
          href="${feedbackLink}"
          style="
            background:#0d6efd;
            color:#ffffff;
            text-decoration:none;
            padding:12px 24px;
            border-radius:5px;
            display:inline-block;
          "
        >
          Give Feedback
        </a>
      </p>

      <p>
        If the button doesn't work, copy and paste the following link into your browser:
      </p>

      <p>
        ${feedbackLink}
      </p>

      <p>
        This link will expire in <strong>24 hours</strong>.
      </p>

      <p>Thank you.</p>
    </div>
  `,
    });
    res.status(200).json({
      success: true,
      message: "Feedback invitation sent successfully.",
    });
  } catch (error) {
    console.error("SEND FEEDBACK ERROR MESSAGE:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get dashboard statistics for admin.
const getDashboardStatistics = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();

    const totalInvitations = await FeedbackInvitation.countDocuments();

    const pendingFeedback = await FeedbackInvitation.countDocuments({
      status: "Pending",
    });

    const completedFeedback = await FeedbackInvitation.countDocuments({
      status: "Completed",
    });

    const expiredInvitations = await FeedbackInvitation.countDocuments({
      status: "Expired",
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalCustomers,
        totalInvitations,
        pendingFeedback,
        completedFeedback,
        expiredInvitations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// Get all feedback for admin.
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: feedback.length,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// Get all feedback invitations for admin.
const getAllInvitations = async (req, res) => {
  try {
    const invitations = await FeedbackInvitation.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: invitations.length,
      invitations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
module.exports = {
  registerAdmin,
  loginAdmin,
  sendTestEmail,
  sendFeedbackInvitation,
  getDashboardStatistics,
  getAllFeedback,
  getAllInvitations,
};
