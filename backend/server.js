const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

const dns = require("dns");

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}
//Database Connection
connectDB();

//routes
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Customer Feedback API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
