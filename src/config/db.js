const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');
const logger = require('../utils/logger');

async function connectDB() {
  if (!MONGO_URI) throw new Error('MONGO_URI is not defined');
  await mongoose.connect(MONGO_URI);
  logger.info('MongoDB connected');
}

module.exports = connectDB;
