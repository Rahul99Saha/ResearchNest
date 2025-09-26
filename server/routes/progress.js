const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");

// Get student progress (student sees their own)
router.get("/", protect, authorize("student"), async (req, res) => {
  const progress = await Progress.find({ student: req.user._id });
  res.json(progress);
});

// Faculty/admin sees all students
router.get("/all", protect, authorize("faculty", "admin"), async (req, res) => {
  const progress = await Progress.find().populate("student", "name email");
  res.json(progress);
});

// Add milestone (student or faculty/admin)
router.post("/", protect, async (req, res) => {
  const { milestone, studentId } = req.body;

  let targetStudent = req.user._id;
  if (req.user.role !== "student") targetStudent = studentId;

  const progress = await Progress.create({
    student: targetStudent,
    milestone,
    updatedBy: req.user._id,
  });
  res.status(201).json(progress);
});

// Update milestone status (faculty/admin can override)
router.put("/:id", protect, async (req, res) => {
  const { status } = req.body;
  const progress = await Progress.findById(req.params.id);
  if (!progress) return res.status(404).json({ msg: "Progress not found" });

  // Only faculty/admin or the student themselves can update
  if (req.user.role === "student" && !progress.student.equals(req.user._id)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  progress.status = status;
  progress.updatedBy = req.user._id;
  await progress.save();
  res.json(progress);
});

module.exports = router;
