const { Redis } = require('@upstash/redis');
const { nanoid } = require('nanoid');

// Lazy initialization of Redis
let redisInstance = null;
const getRedis = () => {
  if (redisInstance) return redisInstance;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redisInstance = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      return redisInstance;
    } catch (e) {
      console.error('Redis Init Error:', e);
      return null;
    }
  }
  return null;
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const redis = getRedis();
  if (!redis) {
    return res.status(500).json({ error: 'Storage not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.' });
  }

  const { method } = req;

  try {
    if (method === 'POST') {
      const { config } = req.body;
      if (!config) {
        return res.status(400).json({ error: 'Config is required' });
      }

      const key = nanoid(10); // Generate a 10-character unique key
      await redis.set(`config:${key}`, JSON.stringify(config), { ex: 60 * 60 * 24 * 30 }); // Store for 30 days

      return res.status(200).json({ key });
    } else if (method === 'GET') {
      const { key } = req.query;
      if (!key) {
        return res.status(400).json({ error: 'Key is required' });
      }

      const configStr = await redis.get(`config:${key}`);
      if (!configStr) {
        return res.status(404).json({ error: 'Configuration not found' });
      }

      const config = typeof configStr === 'string' ? JSON.parse(configStr) : configStr;
      return res.status(200).json({ config });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in /api/config:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
