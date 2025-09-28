const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const { auth, requireRole } = require("../middleware/auth");

// Get current user's full profile
router.get("/my-profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate(
        "researchProfile.supervisor",
        "personalInfo firstName lastName email"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate research progress for response
    const profileData = {
      personalInfo: user.personalInfo,
      role: user.role,
      academicInfo: user.academicInfo,
      facultyInfo: user.facultyInfo,
      researchProfile: user.researchProfile,
      memberSince: user.memberSince,
      lastLogin: user.lastLogin,
      userId: user._id,
    };

    res.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});

// Get public profile by ID
router.get("/:userId", auth, async (req, res) => {
  try {
    const requestedUser = await User.findById(req.params.userId)
      .select("-password -email")
      .populate(
        "researchProfile.supervisor",
        "personalInfo firstName lastName"
      );

    if (!requestedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Basic visibility - users can see profiles within their department
    if (
      req.user.personalInfo.department !==
        requestedUser.personalInfo.department &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied to view this profile",
      });
    }

    const publicProfile = {
      personalInfo: {
        firstName: requestedUser.personalInfo.firstName,
        lastName: requestedUser.personalInfo.lastName,
        department: requestedUser.personalInfo.department,
      },
      role: requestedUser.role,
      researchProfile: {
        researchTopic: requestedUser.researchProfile.researchTopic,
        researchArea: requestedUser.researchProfile.researchArea,
        researchProgress: requestedUser.researchProfile.researchProgress,
        supervisor: requestedUser.researchProfile.supervisor,
      },
      memberSince: requestedUser.memberSince,
    };

    // Add role-specific public info
    if (requestedUser.role === "student") {
      publicProfile.academicInfo = {
        program: requestedUser.academicInfo.program,
        specialization: requestedUser.academicInfo.specialization,
      };
    } else if (requestedUser.role === "faculty") {
      publicProfile.facultyInfo = {
        designation: requestedUser.facultyInfo.designation,
        researchInterests: requestedUser.facultyInfo.researchInterests,
      };
    }

    res.json({
      success: true,
      data: publicProfile,
    });
  } catch (error) {
    console.error("Public profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});

// Update personal information
router.put("/personal-info", auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, department } = req.body;

    const updateData = {
      "personalInfo.firstName": firstName,
      "personalInfo.lastName": lastName,
      "personalInfo.phone": phone,
      "personalInfo.department": department,
      lastUpdated: new Date(),
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Personal information updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Personal info update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating personal information",
    });
  }
});

// Update academic information (Student only)
router.put(
  "/academic-info",
  auth,
  requireRole(["student"]),
  async (req, res) => {
    try {
      const { program, specialization, currentSemester, expectedGraduation } =
        req.body;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            "academicInfo.program": program,
            "academicInfo.specialization": specialization,
            "academicInfo.currentSemester": currentSemester,
            "academicInfo.expectedGraduation": expectedGraduation,
            lastUpdated: new Date(),
          },
        },
        { new: true, runValidators: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Academic information updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Academic info update error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating academic information",
      });
    }
  }
);

// Update faculty information (Faculty only)
router.put(
  "/faculty-info",
  auth,
  requireRole(["faculty", "admin"]),
  async (req, res) => {
    try {
      const { designation, office, officeHours, researchInterests } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            "facultyInfo.designation": designation,
            "facultyInfo.office": office,
            "facultyInfo.officeHours": officeHours,
            "facultyInfo.researchInterests": researchInterests,
            lastUpdated: new Date(),
          },
        },
        { new: true, runValidators: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Faculty information updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Faculty info update error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating faculty information",
      });
    }
  }
);

// Update research information
router.put("/research-info", auth, async (req, res) => {
  try {
    const { researchTopic, researchArea, researchProgress, publications } =
      req.body;

    const updateData = {
      "researchProfile.researchTopic": researchTopic,
      "researchProfile.researchArea": researchArea,
      "researchProfile.researchProgress": researchProgress,
      "researchProfile.publications": publications,
      lastUpdated: new Date(),
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Research information updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Research info update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating research information",
    });
  }
});

// Change password (ONLY account setting implemented)
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Verify current password
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.lastUpdated = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
});

// Faculty: Get supervised students
router.get(
  "/faculty/supervised-students",
  auth,
  requireRole(["faculty", "admin"]),
  async (req, res) => {
    try {
      const supervisedStudents = await User.find({
        "researchProfile.supervisor": req.user.id,
        role: "student",
      }).select("personalInfo academicInfo researchProfile researchProgress");

      res.json({
        success: true,
        data: supervisedStudents,
      });
    } catch (error) {
      console.error("Supervised students fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching supervised students",
      });
    }
  }
);

// Update supervisor (Admin/Faculty only)
router.put(
  "/:studentId/supervisor",
  auth,
  requireRole(["admin", "faculty"]),
  async (req, res) => {
    try {
      const { supervisorId } = req.body;

      const student = await User.findByIdAndUpdate(
        req.params.studentId,
        {
          $set: {
            "researchProfile.supervisor": supervisorId,
            lastUpdated: new Date(),
          },
        },
        { new: true }
      ).select("-password");

      // Add student to faculty's supervisees list
      await User.findByIdAndUpdate(supervisorId, {
        $addToSet: { "researchProfile.supervisees": req.params.studentId },
      });

      res.json({
        success: true,
        message: "Supervisor updated successfully",
        data: student,
      });
    } catch (error) {
      console.error("Supervisor update error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating supervisor",
      });
    }
  }
);

module.exports = router;
