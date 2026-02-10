const logger = require('../utils/logger');

function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  logger.error({ message: err.message, stack: err.stack, path: req.path });
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}

module.exports = { notFound, errorHandler };
