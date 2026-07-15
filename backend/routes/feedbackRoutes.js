const express = require("express");
const {
  validateFeedbackLink,
  submitFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.get("/:token", validateFeedbackLink);

router.post("/:token", submitFeedback);

module.exports = router;
