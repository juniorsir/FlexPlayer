// File: api/stats.js

module.exports = async (req, res) => {
  try {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!upstashUrl || !upstashToken) {
        return res.status(500).json({ error: "Storage configuration missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN." });
    }
    
    // Ensure URL is clean
    const cleanUrl = upstashUrl.replace(/\/$/, "");
    
    // Fetch global stats using Upstash Pipeline
    const response = await fetch(`${cleanUrl}/pipeline`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${upstashToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ["GET", "stats:views:total"],
        ["GET", "stats:watchtime:total"],
        ["KEYS", "active_viewers:*"],
        ["GET", "stats:events:pause"],
        ["GET", "stats:events:seek"],
        ["GET", "stats:events:quality"]
      ])
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Upstash API Error:", response.status, errText);
        return res.status(500).json({ error: "Failed to communicate with storage" });
    }

    const data = await response.json();
    
    // Check if data is an array (pipeline response)
    if (!Array.isArray(data)) {
        console.error("Upstash unexpected response format:", data);
        return res.status(500).json({ error: "Unexpected response from storage" });
    }

    const totalViews = data[0]?.result || 0;
    const totalWatchTimeSeconds = data[1]?.result || 0;
    const activeViewerKeys = data[2]?.result || [];
    const totalPauses = data[3]?.result || 0;
    const totalSeeks = data[4]?.result || 0;
    const totalQualityChanges = data[5]?.result || 0;

    // Calculate active viewers across all videos
    let totalActiveViewers = 0;
    if (activeViewerKeys.length > 0) {
      const activeQueries = activeViewerKeys.map(key => ["ZCARD", key]);
      const activeResponse = await fetch(`${cleanUrl}/pipeline`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${upstashToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activeQueries)
      });
      
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        if (Array.isArray(activeData)) {
            totalActiveViewers = activeData.reduce((sum, item) => sum + (item?.result || 0), 0);
        }
      }
    }

    // Format watch time nicely
    const hours = Math.floor(totalWatchTimeSeconds / 3600);
    const minutes = Math.floor((totalWatchTimeSeconds % 3600) / 60);

    // Return a nice JSON dashboard
    return res.status(200).json({
      live_traffic: {
        active_viewers_right_now: totalActiveViewers || 0
      },
      all_time_stats: {
        total_player_loads: parseInt(totalViews) || 0,
        total_watch_time: `${hours}h ${minutes}m`,
        interactions: {
            total_pauses: parseInt(totalPauses) || 0,
            total_seeks: parseInt(totalSeeks) || 0,
            total_quality_changes: parseInt(totalQualityChanges) || 0
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
