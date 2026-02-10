const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');
const logger = require('../utils/logger');

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  cachedConnection = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10
  });

  logger.info(`MongoDB connected (${mongoose.connection.host})`);
  return cachedConnection;
}

function getDBState() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    readyState: mongoose.connection.readyState,
    status: states[mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
}

module.exports = connectDB;
module.exports.getDBState = getDBState;
async function connectDB() {
  if (!MONGO_URI) throw new Error('MONGO_URI is not defined');
  await mongoose.connect(MONGO_URI);
  logger.info('MongoDB connected');
}

module.exports = connectDB;
