const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");
const {
  seedProgressForStudent,
  getMyProgress,
  getStudentProgress,
  updateNodeStatus,
  overrideNodeStatus,
} = require("../controllers/progressController");

router.post(
  "/seed",
  auth,
  requireRole(["Faculty", "Admin"]),
  seedProgressForStudent
);
router.get("/me", auth, getMyProgress);
router.get(
  "/:studentId",
  auth,
  requireRole(["Faculty", "Admin"]),
  getStudentProgress
);
router.patch("/node/:nodeId", auth, updateNodeStatus);
router.post(
  "/:studentId/node/:nodeId/override",
  auth,
  requireRole(["Faculty", "Admin"]),
  overrideNodeStatus
);

module.exports = router;
