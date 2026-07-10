// File: api/export-offline.js

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
    
    const host = req.headers.host || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    // For standalone offline playback, use window.location.origin as a fallback inside the script if reachable,
    // otherwise the API endpoints will fallback gracefully.
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
        uniqueId: `mpc-offline-${Date.now()}` 
    };

    const htmlBody = getHtml(props); 
    if (!htmlBody) throw new Error("Failed to generate HTML body");

    const css = getCss(); 
    if (!css) throw new Error("Failed to generate CSS");

    const script = getScript({
        ...props,
        videoSrc: JSON.stringify(props.videoSrc),
        apiBaseUrl: `window.location.origin || ${JSON.stringify(props.apiBaseUrl)}`,
        title: JSON.stringify(props.title),
        uniqueId: JSON.stringify(props.uniqueId)
    }); 
    if (!script) throw new Error("Failed to generate Script");
    
    const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${props.title || 'FlexPlayer Standalone'}</title>
  <style>
    /* Standalone body reset */
    body {
      margin: 0;
      padding: 0;
      background: #030712;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow-x: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .media-player-wrapper {
      width: 100%;
      max-width: ${props.maxWidth || '1600px'};
      padding: 16px;
      box-sizing: border-box;
    }
  </style>
  <!-- Load HLS.js for m3u8 streaming support (fails gracefully offline for local mp4 files as fallback) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.10/hls.min.js"></script>
</head>
<body>
  <div class="media-player-wrapper">
    ${htmlBody}
    <style>${css}</style>
    <script>
      // Standalone wrapper self-initialization safety check
      document.addEventListener("DOMContentLoaded", () => {
        ${script}
      });
    </script>
  </div>
</body>
</html>`;

    // Send single-file self-contained offline player HTML as a download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename="player-standalone.html"');
    res.status(200).send(offlineHtml);

  } catch (error) {
    console.error("Fatal Server Error in export-offline:", error);
    res.status(500).json({ error: "Export Error", message: error.message });
  }
};
