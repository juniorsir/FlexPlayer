// File: api/beacon.js

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Parse the data sent by the player's heartbeat
    let data = req.body;
    if (typeof data === 'string') data = JSON.parse(data);

    const { videoId, uniqueViewerId, events } = data;
    if (!videoId || !uniqueViewerId) return res.status(400).end();

    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!upstashUrl || !upstashToken) return res.status(500).json({ error: "Storage config missing" });
    
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    // 1. ZADD: Logs the viewer's ID with the current timestamp.
    // 2. ZREMRANGEBYSCORE: Removes anyone who hasn't pinged in the last 45 seconds (they left).
    // 3. INCRBY: Adds 15 seconds to total platform watch time.
    // 4. INCRBY: Adds 15 seconds to this specific video's watch time.
    const pipeline = [
      ["ZADD", `active_viewers:${videoId}`, now, uniqueViewerId],
      ["ZREMRANGEBYSCORE", `active_viewers:${videoId}`, "-inf", now - 45],
      ["INCRBY", "stats:watchtime:total", 15],
      ["INCRBY", `stats:watchtime:video:${videoId}`, 15]
    ];

    if (events) {
      if (events.pause) {
        pipeline.push(["INCRBY", "stats:events:pause", events.pause]);
        pipeline.push(["INCRBY", `stats:events:pause:video:${videoId}`, events.pause]);
      }
      if (events.seek) {
        pipeline.push(["INCRBY", "stats:events:seek", events.seek]);
        pipeline.push(["INCRBY", `stats:events:seek:video:${videoId}`, events.seek]);
      }
      if (events.quality) {
        pipeline.push(["INCRBY", "stats:events:quality", events.quality]);
        pipeline.push(["INCRBY", `stats:events:quality:video:${videoId}`, events.quality]);
      }
    }

    const cleanUrl = upstashUrl.replace(/\/$/, "");
    
    await fetch(`${cleanUrl}/pipeline`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${upstashToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pipeline)
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Beacon Error:", e);
    return res.status(500).end();
  }
};
