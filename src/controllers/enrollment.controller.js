const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const { sendEnrollmentEmail } = require('../services/email.service');

exports.enroll = async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const enrollment = await Enrollment.findOneAndUpdate(
    { user: req.user.id, course: req.params.courseId },
    { user: req.user.id, course: req.params.courseId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: req.params.courseId } });

  const user = await User.findById(req.user.id);
  await sendEnrollmentEmail(user.email, course.title);

  return res.status(201).json({ message: 'Enrollment successful', enrollment });
};

exports.updateProgress = async (req, res) => {
  const { lessonId, completed } = req.body;

  const enrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.courseId });
  if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

  const lesson = enrollment.progress.find((item) => item.lessonId === lessonId);
  if (lesson) {
    lesson.completed = completed;
  } else {
    enrollment.progress.push({ lessonId, completed });
  }

  if (enrollment.progress.length) {
    const completedCount = enrollment.progress.filter((item) => item.completed).length;
    enrollment.completionPercent = Math.round((completedCount / enrollment.progress.length) * 100);
  }

  await enrollment.save();
  return res.json({ message: 'Progress updated', enrollment });
};
