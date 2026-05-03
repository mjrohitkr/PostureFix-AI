require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// DB connect
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/user', require('./routes/authRoutes'));
app.use('/uploads', express.static('uploads'));

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🔥 Server running on port ${process.env.PORT}`);
});