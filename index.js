const app = require('./src/app');
const connectDB = require('./src/config/db');
const { PORT } = require('./src/config/env');
const logger = require('./src/utils/logger');

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (error) {
    logger.error({ message: 'Failed to start server', error });
    process.exit(1);
  }
}

start();
