const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { addToWishlist, getStudentDashboard, getInstructorDashboard } = require('../controllers/user.controller');

const router = Router();

router.post('/wishlist/:courseId', authenticate, authorize('student'), addToWishlist);
router.get('/dashboard/student', authenticate, authorize('student'), getStudentDashboard);
router.get('/dashboard/instructor', authenticate, authorize('instructor', 'admin'), getInstructorDashboard);

module.exports = router;
