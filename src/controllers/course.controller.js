const Course = require('../models/course.model');
const Review = require('../models/review.model');
const { uploadBuffer } = require('../services/cloudinary.service');

exports.createCourse = async (req, res) => {
  const payload = { ...req.body, instructor: req.user.id };

  if (req.files?.thumbnail?.[0]) {
    const uploadedThumb = await uploadBuffer(req.files.thumbnail[0].buffer, 'course-thumbnails');
    payload.thumbnailUrl = uploadedThumb.secure_url;
  }

  if (req.files?.previewVideo?.[0]) {
    const uploadedPreview = await uploadBuffer(req.files.previewVideo[0].buffer, 'course-previews');
    payload.previewVideoUrl = uploadedPreview.secure_url;
  }

  const course = await Course.create(payload);
  return res.status(201).json({ message: 'Course created', course });
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const canManage = req.user.role === 'admin' || String(course.instructor) === req.user.id;
  if (!canManage) return res.status(403).json({ error: 'Not allowed to edit this course' });

  Object.assign(course, req.body);
  await course.save();
  return res.json({ message: 'Course updated', course });
};

exports.deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const canManage = req.user.role === 'admin' || String(course.instructor) === req.user.id;
  if (!canManage) return res.status(403).json({ error: 'Not allowed to delete this course' });

  await course.deleteOne();
  return res.json({ message: 'Course deleted' });
};

exports.listCourses = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 50);

  const filter = { published: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.rating) filter.averageRating = { $gte: Number(req.query.rating) };
  if (req.query.search) filter.$text = { $search: req.query.search };

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Course.countDocuments(filter)
  ]);

  return res.json({ page, limit, total, courses });
};

exports.previewCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).select('title description previewVideoUrl thumbnailUrl category difficulty');
  if (!course) return res.status(404).json({ error: 'Course not found' });
  return res.json({ course });
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findOneAndUpdate(
    { course: req.params.id, user: req.user.id },
    { rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const agg = await Review.aggregate([
    { $match: { course: review.course } },
    { $group: { _id: '$course', avgRating: { $avg: '$rating' } } }
  ]);

  await Course.findByIdAndUpdate(req.params.id, { averageRating: agg[0]?.avgRating || rating });
  return res.status(201).json({ message: 'Review saved', review });
};
