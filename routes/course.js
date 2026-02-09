const { Router } = require('express');
const { courseModel, userModel, purchaseModel } = require('../db');
const jwt = require('jsonwebtoken');

const courseRouter = Router();

// Middleware: verify user token
function authUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// 📋 Preview all courses
courseRouter.get('/preview', async (req, res) => {
  try {
    const courses = await courseModel.find();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛒 Purchase a course (protected)
courseRouter.post('/purchase/:courseId', authUser, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.userId;

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Save purchase record
    const purchase = new purchaseModel({ user: userId, course: courseId });
    await purchase.save();

    // Add to user's purchasedCourses
    await userModel.findByIdAndUpdate(userId, {
      $push: { purchasedCourses: courseId }
    });

    res.json({ message: "Course purchased successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = courseRouter;
