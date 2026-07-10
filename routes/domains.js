// File: api/domains.js

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

// We'll store our domains in a Redis "Set" for automatic uniqueness.
const DOMAINS_KEY = 'allowed_domains';

module.exports = async (req, res) => {
  try {
    const redis = getRedis();
    if (!redis) {
      return res.status(500).json({ error: 'Storage (Redis) not configured.' });
    }
    // --- Authentication: Protect this endpoint ---
    const serverApiKey = process.env.PLAYER_API_KEY;
    const clientApiKey = req.headers['x-api-key'];

    if (!serverApiKey || !clientApiKey || clientApiKey !== serverApiKey) {
      return res.status(403).json({ error: 'Forbidden: Invalid or missing API key.' });
    }

    // --- Route requests based on HTTP method ---
    switch (req.method) {
      case 'GET': {
        // Fetch all domains from the Set
        const domains = await redis.smembers(DOMAINS_KEY);
        return res.status(200).json(domains);
      }
      
      case 'POST': {
        const { domain } = req.body;
        // Basic validation
        if (!domain || typeof domain !== 'string' || !domain.includes('.')) {
          return res.status(400).json({ error: 'Invalid domain format.' });
        }
        // Add the domain to the Set. 'sadd' is idempotent.
        await redis.sadd(DOMAINS_KEY, domain.trim().toLowerCase());
        return res.status(201).json({ message: `Domain '${domain}' added successfully.` });
      }

      case 'DELETE': {
        const { domain } = req.body;
        if (!domain || typeof domain !== 'string') {
          return res.status(400).json({ error: 'Invalid domain provided for deletion.' });
        }
        // Remove the domain from the Set.
        await redis.srem(DOMAINS_KEY, domain.trim().toLowerCase());
        return res.status(200).json({ message: `Domain '${domain}' removed successfully.` });
      }

      default: {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("Domains API Error:", error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
