const Feedback = require("../models/Feedback");
const { submitFeedbackSchema } = require("../validators/feedbackValidator");
const FeedbackInvitation = require("../models/FeedbackInvitation");

const validateFeedbackLink = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await FeedbackInvitation.findOne({ token }).populate(
      "customer",
      "name email",
    );

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invalid feedback link.",
      });
    }

    if (invitation.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Feedback has already been submitted.",
      });
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = "Expired";
      await invitation.save();

      return res.status(400).json({
        success: false,
        message: "Feedback link has expired.",
      });
    }

    res.status(200).json({
      success: true,
      customer: invitation.customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//feedback submission handler.
const submitFeedback = async (req, res) => {
  try {
    const { token } = req.params;

    const { error } = submitFeedbackSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const invitation = await FeedbackInvitation.findOne({ token });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invalid feedback link.",
      });
    }

    if (invitation.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Feedback has already been submitted.",
      });
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = "Expired";
      await invitation.save();

      return res.status(400).json({
        success: false,
        message: "Feedback link has expired.",
      });
    }

    const { rating, comment } = req.body;

    await Feedback.create({
      customer: invitation.customer,
      invitation: invitation._id,
      rating,
      comment,
    });

    invitation.status = "Completed";
    invitation.completedAt = new Date();

    await invitation.save();

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  validateFeedbackLink,
  submitFeedback,
};
