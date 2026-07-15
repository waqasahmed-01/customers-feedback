const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  sendTestEmail,
  sendFeedbackInvitation,
  getDashboardStatistics,
  getAllFeedback,
  getAllInvitations,
} = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});
router.post("/send-test-email", protect, sendTestEmail);
router.post("/send-feedback", protect, sendFeedbackInvitation);
router.get("/dashboard", protect, getDashboardStatistics);
router.get("/feedback", protect, getAllFeedback);
router.get("/invitations", protect, getAllInvitations);

module.exports = router;
