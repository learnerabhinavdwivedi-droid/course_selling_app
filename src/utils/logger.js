let logger;

try {
  const winston = require('winston');
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()]
  });
} catch (error) {
  const fallback = (level) => (...args) => {
    // eslint-disable-next-line no-console
    console[level === 'error' ? 'error' : 'log'](...args);
  };

  logger = {
    info: fallback('info'),
    warn: fallback('warn'),
    error: fallback('error')
  };
}

module.exports = logger;
