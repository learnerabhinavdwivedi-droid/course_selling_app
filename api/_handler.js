const app = require('../src/app');
const connectDB = require('../src/config/db');

let initPromise;

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = connectDB().catch((error) => {
      initPromise = undefined;
      throw error;
    });
  }

  return initPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureInitialized();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      error: 'Server initialization failed',
      details: error.message
    });
  }
};
