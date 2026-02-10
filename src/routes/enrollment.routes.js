const { Router } = require('express');
const { enroll, updateProgress } = require('../controllers/enrollment.controller');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.post('/:courseId', authenticate, authorize('student'), enroll);
router.patch('/:courseId/progress', authenticate, authorize('student'), updateProgress);

module.exports = router;
