const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Routers
const courseRouter = require('./routes/course');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use(express.json());

// Mount routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/course', courseRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Course Selling API');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// ✅ MongoDB connection
async function main() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not defined in .env");

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');

    app.listen(3005, () => {
      console.log('Server running on port 3005');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

main();
