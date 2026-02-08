const { Router } = require('express');


const courseRouter = Router();

courseRouter.post('/purchase', (req, res) => {
  res.json({ message: "Course purchased successfully" });
});

courseRouter.get('/preview', (req, res) => {
  res.json({ message: "Course preview" });
});

module.exports = courseRouter; // ✅ export only the router
