// File: api/generate.js

const { getHtml } = require('../components/component.html.js');
const { getCss } = require('../components/component.css.js');
const { getScript } = require('../components/component.script.js');

const sanitizeHTML = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[match]);
};

module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); 

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' }); 
    
    const data = req.body;
    if (!data || !data.videoSrc || !data.thumbnailSrc) { 
        return res.status(400).json({ error: 'videoSrc and thumbnailSrc are required.' }); 
    }
    
    const host = req.headers.host;
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const props = { 
        ...data, 
        apiBaseUrl: `${protocol}://${host}`, 
        title: sanitizeHTML(data.title || ''), 
        description: sanitizeHTML(data.description || ''), 
        writers: data.writers || [], 
        directors: data.directors || [], 
        stars: data.stars || [], 
        annotations: (data.annotations || []).map((ann, idx) => ({ ...ann, id: `ann-${idx}`, text: sanitizeHTML(ann.text || '') })),
        ads: data.ads || [], 
        watermark: data.watermark || null, 
        subtitles: data.subtitles || [], 
        subtitlesAppearance: data.subtitlesAppearance || null,
        controls: data.controls || {},
        ambientConfig: data.ambientConfig || null,
        shareUrl: data.shareUrl || '',
        shareText: data.shareText || '',
        uniqueId: `mpc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
    };

    // --- UPSTASH REDIS TRACKING (Fire & Forget) ---
    // Using your keys to increment total views and views for this specific video
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (upstashUrl && upstashToken) {
      fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${upstashToken}` },
        body: JSON.stringify([
            ["INCR", "stats:views:total"],
            ["INCR", `stats:views:video:${props.videoSrc}`]
        ])
      }).catch(e => console.error("Redis Analytics Error", e));
    } else {
      console.warn("Analytics skipped: Redis config missing");
    }
    // ----------------------------------------------
    
    const htmlBody = getHtml(props); 
    if (!htmlBody) throw new Error("Failed to generate HTML body");

    const css = getCss(); 
    if (!css) throw new Error("Failed to generate CSS");

    const script = getScript({
        ...props,
        videoSrc: JSON.stringify(props.videoSrc),
        apiBaseUrl: JSON.stringify(props.apiBaseUrl),
        title: JSON.stringify(props.title),
        uniqueId: JSON.stringify(props.uniqueId)
    }); 
    if (!script) throw new Error("Failed to generate Script");
    
    const fullHtmlResponse = `<div class="media-player-wrapper">${htmlBody}<style>${css}</style><script>${script}</script></div>`;
    res.setHeader('Content-Type', 'text/html').status(200).send(fullHtmlResponse);

  } catch (error) {
    console.error("Fatal Server Error:", error);
    res.status(500).json({ error: "API Error", message: error.message });
  }
};
