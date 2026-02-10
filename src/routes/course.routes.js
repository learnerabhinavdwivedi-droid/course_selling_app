const { Router } = require('express');
const multer = require('multer');
const {
  createCourse,
  updateCourse,
  deleteCourse,
  listCourses,
  previewCourse,
  addReview
} = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCourseValidator } = require('../validators/course.validators');
const { cacheMiddleware } = require('../middleware/cache');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', cacheMiddleware('course-list'), listCourses);
router.get('/:id/preview', previewCourse);
router.post('/:id/reviews', authenticate, authorize('student'), addReview);

router.post(
  '/',
  authenticate,
  authorize('admin', 'instructor'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'previewVideo', maxCount: 1 }
  ]),
  createCourseValidator,
  validate,
  createCourse
);
router.put('/:id', authenticate, authorize('admin', 'instructor'), updateCourse);
router.delete('/:id', authenticate, authorize('admin', 'instructor'), deleteCourse);

module.exports = router;
