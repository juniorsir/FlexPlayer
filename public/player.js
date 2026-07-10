// File: public/player.js

(() => {
  let apiEndpoint = '';
  try {
    const playerScript = document.querySelector('script[src*="/player.js"]');
    if (!playerScript) throw new Error('Could not find player.js <script> tag.');
    // Use the absolute URL of the script to determine where the API is
    const scriptUrl = new URL(playerScript.src, window.location.href);
    apiEndpoint = `${scriptUrl.origin}/api/generate`;
  } catch (e) {
    console.error(`MediaPlayer Fatal Error: ${e.message}`);
    // Fallback to current origin if script detection fails
    apiEndpoint = `${window.location.origin}/api/generate`;
  }

  const renderPlayerFromPayload = async (playerNode, payload) => {
    try {
      if (!payload.videoSrc || !payload.thumbnailSrc) throw new Error('Missing required videoSrc or thumbnailSrc in configuration.');
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${err.message || err.error || response.statusText}`);
      }
      
      const playerHtml = await response.text();
      if (!playerHtml) throw new Error("API returned empty HTML.");
      
      playerNode.innerHTML = playerHtml;
      
      const scripts = Array.from(playerNode.querySelectorAll('script'));
      const executeScripts = async () => {
        for (const oldScript of scripts) {
          await new Promise((resolve) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            if (oldScript.src) {
              newScript.onload = resolve;
              newScript.onerror = resolve; 
            } else {
              newScript.textContent = oldScript.textContent;
              setTimeout(resolve, 0);
            }
            document.body.appendChild(newScript);
            oldScript.remove();
          });
        }
      };
      
      executeScripts();

    } catch (error) {
      console.error('MediaPlayer Error:', error);
      playerNode.innerHTML = `
        <div style="position:relative;width:100%;padding-bottom:56.25%;background:#111827;border-radius:16px;border:1px solid #ef4444;">
           <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fca5a5;font-family:sans-serif;text-align:center;">
             <b>Player Load Failed:</b><br>${error.message}
           </div>
        </div>`;
    }
  }

  const initializePlayer = async (playerNode) => {
    let payload = {};
    const dataset = playerNode.dataset;

    const safeJsonParse = (str, fallback = null) => {
      if (!str) return fallback;
      try { return JSON.parse(str); } catch (e) { 
        // Fallback: Try to parse as key:value,key:value
        if (str.includes(':')) {
          const obj = {};
          str.split(',').forEach(kv => {
            const [k, v] = kv.split(':').map(s => s.trim());
            if (k && v !== undefined) {
              obj[k] = v === 'true' ? true : (v === 'false' ? false : v);
            }
          });
          return obj;
        }
        return fallback; 
      }
    };

    // Extract attributes but keep track of what's actually there
    const datasetControls = dataset.controls ? safeJsonParse(dataset.controls, {}) : {};
    const datasetAmbient = dataset.ambientConfig ? safeJsonParse(dataset.ambientConfig, {}) : {};

    // Collect individual data-ambient-* and data-controls-* attributes
    Object.keys(dataset).forEach(key => {
      if (key.startsWith('ambient') && key !== 'ambientConfig') {
        let prop = key.slice(7);
        if (prop) {
          prop = prop.charAt(0).toLowerCase() + prop.slice(1);
          datasetAmbient[prop] = dataset[key] === 'true' ? true : (dataset[key] === 'false' ? false : dataset[key]);
        } else {
          // data-ambient="true/false"
          datasetAmbient.enabled = dataset[key] === 'true';
        }
      }
      if (key.startsWith('controls') && key !== 'controls') {
        let prop = key.slice(8);
        if (prop) {
          prop = prop.charAt(0).toLowerCase() + prop.slice(1);
          datasetControls[prop] = dataset[key] === 'true' ? true : (dataset[key] === 'false' ? false : dataset[key]);
        }
      }
    });

    // Create a base payload from dataset
    payload = {
      videoSrc: dataset.videoSrc,
      thumbnailSrc: dataset.thumbnailSrc,
      title: dataset.title,
      description: dataset.description,
      writers: safeJsonParse(dataset.writers, null),
      directors: safeJsonParse(dataset.directors, null),
      stars: safeJsonParse(dataset.stars, null),
      annotations: safeJsonParse(dataset.annotations, null),
      ads: safeJsonParse(dataset.ads, null),
      watermark: safeJsonParse(dataset.watermark, null),
      subtitles: safeJsonParse(dataset.subtitles, null),
      subtitlesAppearance: safeJsonParse(dataset.subtitlesAppearance, null),
      controls: Object.keys(datasetControls).length ? datasetControls : null,
      ambientConfig: Object.keys(datasetAmbient).length ? datasetAmbient : null,
      shareUrl: dataset.shareUrl,
      shareText: dataset.shareText,
      debug: dataset.debug ? dataset.debug === 'true' : null,
      version: dataset.version,
      configKey: dataset.configKey
    };

    if (payload.configKey) {
      try {
        const configApiUrl = apiEndpoint.replace('/api/generate', '/api/config');
        const response = await fetch(`${configApiUrl}?key=${payload.configKey}`);
        if (response.ok) {
          const cloudData = await response.json();
          if (cloudData.config) {
            const cloud = cloudData.config;
            
            // Use cloud config as the base for any fields NOT explicitly provided in the dataset
            Object.keys(cloud).forEach(key => {
              const datasetValue = dataset[key] || 
                                  (key === 'videoSrc' ? dataset.videoSrc : null) ||
                                  (key === 'thumbnailSrc' ? dataset.thumbnailSrc : null);
              
              // If the payload field is null or undefined, use the cloud value
              if (payload[key] === null || payload[key] === undefined) {
                payload[key] = cloud[key];
              } else if (typeof payload[key] === 'object' && typeof cloud[key] === 'object' && payload[key] !== null && cloud[key] !== null) {
                // For nested objects like controls and ambientConfig, merge them 
                // but prioritize dataset values
                payload[key] = { ...cloud[key], ...payload[key] };
              }
            });
          }
        }
      } catch (e) {
        console.error('FlexPlayer: Error fetching cloud config:', e);
      }
    }

    if (playerNode.dataset.config) {
      try {
         const decoded = JSON.parse(decodeURIComponent(escape(atob(playerNode.dataset.config))));
         payload = { ...payload, ...decoded };
      } catch(e) {
         console.error('Failed to parse media player configuration: ' + e.message);
      }
    }
    
    if (playerNode.dataset.configUrl) {
      try {
        const response = await fetch(playerNode.dataset.configUrl.replace(/["']/g, '')); // Clean quotes if malformed
        if (response.ok) {
          const externalConfig = await response.json();
          
          // Merge strategy: Start with config.json, then override with non-null payload fields
          const finalPayload = { ...externalConfig };
          
          Object.keys(payload).forEach(key => {
            if (payload[key] !== null && payload[key] !== undefined) {
              if (key === 'controls' || key === 'ambientConfig') {
                finalPayload[key] = { ...(finalPayload[key] || {}), ...payload[key] };
              } else {
                finalPayload[key] = payload[key];
              }
            }
          });
          payload = finalPayload;
        }
      } catch (e) {
        console.error('FlexPlayer: Error fetching config from URL:', playerNode.dataset.configUrl, e);
      }
    }

    await renderPlayerFromPayload(playerNode, payload);
  };

  // Function to find and initialize un-initialized players instantly
  const scanForPlayers = () => {
    const players = document.querySelectorAll('.media-player-embed:not(.mp-initialized), .flex-player:not(.mp-initialized)');
    if (players.length > 0) {
      console.log(`FlexPlayer: Detected ${players.length} player(s). Initializing...`);
    }
    players.forEach(node => {
      // Mark as initialized to prevent double-loading
      node.classList.add('mp-initialized');
      
      // Inject instant skeleton placeholder to prevent layout shift
      node.innerHTML = `
        <div style="position:relative;width:100%;max-width:1600px;margin:auto;aspect-ratio:16/9;background:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;">
             <div style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;border:3px solid rgba(255,255,255,0.1);"></div>
             <div style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;border:3px solid transparent;border-top-color:#8b5cf6;border-right-color:#8b5cf6;animation:mpc-air-spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;filter:drop-shadow(0 0 8px #8b5cf6);"></div>
          </div>
        </div>
        <style>@keyframes mpc-air-spin { to { transform: rotate(360deg); } }</style>
      `;

      // Start fetching the player in the background
      initializePlayer(node);
    });
  };

  // 1. Run immediately for any elements already parsed by the browser
  scanForPlayers();

  // 2. Watch the DOM for any players added dynamically or later in the HTML parsing
  if (document.body) {
    new MutationObserver(scanForPlayers).observe(document.body, { childList: true, subtree: true });
  } else {
    // If <script> is in <head>, wait for body to exist, then observe
    document.addEventListener('DOMContentLoaded', () => {
      scanForPlayers();
      new MutationObserver(scanForPlayers).observe(document.body, { childList: true, subtree: true });
    });
  }

  // Expose an explicit JavaScript object for developers who want to automate initialization:
  // e.g., window.FlexPlayer.mount('#my-container', { videoSrc: '...', title: '...' })
  window.FlexPlayer = {
    scan: scanForPlayers,
    setShare: (selectorOrElement, shareUrl, shareText) => {
      let node;
      if (typeof selectorOrElement === 'string') {
        node = document.querySelector(selectorOrElement);
      } else {
        node = selectorOrElement;
      }
      if (!node) return console.error('FlexPlayer Error: Target element not found for setShare().');
      
      if (shareUrl !== undefined) node.dataset.shareUrl = shareUrl;
      if (shareText !== undefined) node.dataset.shareText = shareText;
    },
    mount: async (selectorOrElement, options = {}) => {
      let node;
      if (typeof selectorOrElement === 'string') {
        node = document.querySelector(selectorOrElement);
      } else {
        node = selectorOrElement;
      }
      
      if (!node) return console.error('FlexPlayer Error: Target element not found for mount().');
      
      node.classList.add('media-player-embed', 'mp-initialized');
      
      // Inject instant skeleton placeholder
      node.innerHTML = `
        <div style="position:relative;width:100%;max-width:1600px;margin:auto;aspect-ratio:16/9;background:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;">
             <div style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;border:3px solid rgba(255,255,255,0.1);"></div>
             <div style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;border:3px solid transparent;border-top-color:#8b5cf6;border-right-color:#8b5cf6;animation:mpc-air-spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;filter:drop-shadow(0 0 8px #8b5cf6);"></div>
          </div>
        </div>
      `;
      
      await renderPlayerFromPayload(node, options);
    },
    
    // Update or re-initialize a player instance
    update: async (selectorOrElement, options = {}) => {
      let node;
      if (typeof selectorOrElement === 'string') {
        node = selectorOrElement.startsWith('#') || selectorOrElement.startsWith('.') || selectorOrElement.includes('[') 
          ? document.querySelector(selectorOrElement) 
          : document.getElementById(selectorOrElement);
      } else {
        node = selectorOrElement;
      }

      if (!node) return console.error('FlexPlayer Error: Target element not found for update().');
      
      // If we are updating an existing mounted player, we merge options or just re-render
      // initializePlayer will read from dataset if dataset is updated, but mount-style options are better
      await renderPlayerFromPayload(node, options);
    }
  };

  // Backwards compatibility
  window.updateMediaPlayer = window.FlexPlayer.update;
})();
