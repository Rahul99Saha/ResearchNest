// server/src/controllers/faculty.js
const User = require("../models/User");
const ProgressInstance = require("../models/ProgressInstance");

// Get all students (for faculty)
const getMyStudents = async (req, res) => {
  try {
    // ✅ If only one faculty, we don’t need to filter by facultyId
    // Fetch all users with role "student"
    const students = await User.find({ role: "Student" }).select("-password");

    // Optionally fetch their progress instances
    const studentIds = students.map((s) => s._id);
    const progress = await ProgressInstance.find({
      studentId: { $in: studentIds },
    });

    // Combine student info with progress
    const result = students.map((student) => {
      const prog = progress.find(
        (p) => p.studentId.toString() === student._id.toString()
      );
      return {
        ...student.toObject(),
        progress: prog || null,
      };
    });

    return res.json(result);
  } catch (err) {
    console.error("Error fetching students:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMyStudents };
