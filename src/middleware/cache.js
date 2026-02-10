const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

function cacheMiddleware(prefix) {
  return (req, res, next) => {
    const key = `${prefix}:${JSON.stringify(req.query)}`;
    const cached = cache.get(key);

    if (cached) {
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (payload) => {
      cache.set(key, payload);
      return originalJson(payload);
    };

    return next();
  };
}

module.exports = { cacheMiddleware, cache };
