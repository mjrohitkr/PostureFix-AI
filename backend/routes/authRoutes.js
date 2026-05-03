const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({
      success: true,
      message: "Registered",
      id: user._id,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= IMAGE UPLOAD =================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload-image", upload.single("avatar"), async (req, res) => {
  console.log("REQ FILE:", req.file);
  try {
    // ❌ agar file nahi aayi toh error na aaye
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.filename;

    res.json({
      success: true,
      avatar_url: `http://localhost:5000/uploads/${filePath}`,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= DASHBOARD APIs =================
router.get("/workout/stats", (req, res) => {
  res.json({
    total_workouts: 10,
    total_reps: 200,
    total_calories: 500,
    total_duration: 1200,
    average_posture_score: 90,
    exercises_breakdown: {
      squat: { reps: 100 },
      pushup: { reps: 100 },
    },
  });
});

router.get("/workout/history", (req, res) => {
  res.json([
    { exercise_type: "squat", reps: 20 },
    { exercise_type: "pushup", reps: 15 },
  ]);
});

module.exports = router;