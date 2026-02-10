const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3005,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/course_selling',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  STRIPE_KEY: process.env.STRIPE_KEY || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};
