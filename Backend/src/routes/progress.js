const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const { seedProgressForStudent, getMyProgress, getStudentProgress, updateNodeStatus, overrideNodeStatus } = require('../controllers/progressController');

router.post('/seed', auth, requireRole(['faculty','admin']), seedProgressForStudent);
router.get('/me', auth, getMyProgress);
router.get('/:studentId', auth, requireRole(['faculty','admin']), getStudentProgress);
router.patch('/node/:nodeId', auth, updateNodeStatus);
router.post('/:studentId/node/:nodeId/override', auth, requireRole(['faculty','admin']), overrideNodeStatus);

module.exports = router;