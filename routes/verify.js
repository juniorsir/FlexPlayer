// File: api/verify.js

const { Redis } = require('@upstash/redis');

// Lazy load Redis to prevent startup issues
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
  const redis = getRedis();
  // Add this line for debugging. Remove it later.
  console.log(`[VERIFY DEBUG] Current NODE_ENV is: "${process.env.NODE_ENV}"`);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ verified: false, error: 'Method Not Allowed' });
  }

  try {
    const { origin } = req.body;
    if (!origin) {
      return res.status(400).json({ verified: false, error: 'Origin not provided.' });
    }

    // DEVELOPMENT MODE CHECK:
    // This allows any origin starting with 'http://localhost' to pass during development.
    if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
      console.log(`[VERIFY LOG] DEV MODE: Automatically verifying request from origin "${origin}".`);
      return res.status(200).json({ verified: true });
    }

    // PRODUCTION LOGIC:
    const allowedOriginsFromEnv = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
    const dynamicAllowedOrigins = redis ? await redis.smembers('allowed_domains') : [];
    const allAllowedOrigins = new Set([...allowedOriginsFromEnv, ...dynamicAllowedOrigins]);
    const isAllowed = allAllowedOrigins.has(origin);
    
    console.log(`[VERIFY LOG] PROD MODE: Verification request from origin "${origin}". Allowed: ${isAllowed}`);

    return res.status(200).json({ verified: isAllowed });

  } catch (error) {
    console.error("!!! VERIFY API ERROR !!!", error);
    return res.status(500).json({ verified: false, error: 'Server error during verification.' });
  }
};
