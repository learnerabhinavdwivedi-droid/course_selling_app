const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { createCoursePayment, confirmPayment, refundPayment } = require('../controllers/payment.controller');

const router = Router();

router.post('/course/:courseId', authenticate, authorize('student'), createCoursePayment);
router.patch('/:paymentId/confirm', authenticate, authorize('student', 'admin'), confirmPayment);
router.post('/:paymentId/refund', authenticate, authorize('admin'), refundPayment);

module.exports = router;
