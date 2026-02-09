const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { userModel } = require('../db');

const userRouter = Router();

// 🔑 User signup
userRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ email, password: hashedPassword, firstname, lastname });
    await user.save();

    res.json({ message: "Signed up successfully" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
});

// 🔑 User signin
userRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Signed in successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Signin failed", details: error.message });
  }
});

// 📋 Get purchased courses (protected)
userRouter.get('/purchased', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).populate("purchasedCourses");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ purchasedCourses: user.purchasedCourses });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchased courses", details: error.message });
  }
});

module.exports = userRouter;
