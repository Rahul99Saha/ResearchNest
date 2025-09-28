// server/src/routes/faculty.js
import express from "express";
import { getMyStudents } from "../controllers/facultyController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Faculty can view all students
router.get("/my-students", auth, requireRole(["Faculty"]), getMyStudents);

export default router;
