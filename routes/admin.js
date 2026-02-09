const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { adminModel, courseModel } = require("../db");

const adminRouter = Router();

// 🔑 Admin signup
adminRouter.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await adminModel.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new adminModel({ username, password: hashedPassword });
    await admin.save();

    res.json({ message: "Admin signed up successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Admin signin
adminRouter.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await adminModel.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Admin signed in successfully", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📝 Create course (protected)
adminRouter.post('/create-course', async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const course = new courseModel({ title, description, price });
    await course.save();

    res.json({ message: "Course created successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Manage courses
adminRouter.get('/manage-courses', async (req, res) => {
  try {
    const courses = await courseModel.find();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = adminRouter;
