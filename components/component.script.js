// File: api/component.script.js

const getScript = (props) => {
  const {
    uniqueId,
    videoSrc,
    thumbnailSrc,
    title = '',
    ads = [],
    debug = false,
    annotations = [],
    apiBaseUrl,
    shareUrl = '',
    shareText = '',
    aspectRatio = '16 / 9',
    ambientConfig = null,
    controls = {}
  } = props;

  return `
(() => {
    "use strict";
  
    const API_BASE_URL = ${apiBaseUrl};
    const CONTROLS = ${JSON.stringify(controls)};
    const AMBIENT_CONFIG = ${JSON.stringify(ambientConfig)};
    const normalize = (val, def) => (val === true || val === 'true') ? true : (val === false || val === 'false' ? false : def);
    const c = {
      pip: normalize(CONTROLS.pip, true),
      fullscreen: normalize(CONTROLS.fullscreen, true),
      mute: normalize(CONTROLS.mute, true),
      settings: normalize(CONTROLS.settings, true),
      speed: normalize(CONTROLS.speed, true),
      quality: normalize(CONTROLS.quality, true),
      subtitles: normalize(CONTROLS.subtitles, false),
      ambient: normalize(CONTROLS.ambient, AMBIENT_CONFIG !== null),
      annotations: normalize(CONTROLS.annotations, true),
      sleep: normalize(CONTROLS.sleep, true),
      stableVolume: normalize(CONTROLS.stableVolume, true),
      loop: normalize(CONTROLS.loop, true),
      shortcuts: normalize(CONTROLS.shortcuts, true),
      network: normalize(CONTROLS.network, true),
      share: normalize(CONTROLS.share, true)
    };
    
    const component = document.getElementById(${uniqueId});
    if (!component) return;

    let analyticsQueue = { pause: 0, seek: 0, quality: 0 };

    const startAnalyticsBeacon = () => {
        let uniqueViewerId;
        try {
            uniqueViewerId = sessionStorage.getItem('mpc-viewer-id') || Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem('mpc-viewer-id', uniqueViewerId);
        } catch (e) {
            uniqueViewerId = Math.random().toString(36).substring(2, 15);
        }
        let beaconInterval;
        const beaconUrl = \`\${API_BASE_URL}/api/beacon\`; 

        const sendBeacon = () => {
            if (document.hidden || !video || video.paused) return;
            const payload = { 
                videoId: ${videoSrc}, 
                uniqueViewerId: uniqueViewerId, 
                events: analyticsQueue 
            };
            // Reset queue after preparing payload
            analyticsQueue = { pause: 0, seek: 0, quality: 0 };

            try {
                if (navigator.sendBeacon) { navigator.sendBeacon(beaconUrl, JSON.stringify(payload)); } 
                else { fetch(beaconUrl, { method: 'POST', body: JSON.stringify(payload), keepalive: true }); }
            } catch (e) {}
        };
        video?.addEventListener('play', () => {
            clearInterval(beaconInterval);
            sendBeacon();
            beaconInterval = setInterval(sendBeacon, 15000);
        });
        video?.addEventListener('pause', () => { 
            analyticsQueue.pause++; 
            clearInterval(beaconInterval); 
        });
        video?.addEventListener('ended', () => { clearInterval(beaconInterval); });
    };

    const componentId = ${uniqueId};
    let hls;
    let dashApp;
    let playbackHasStarted = false;
    const playerContainer = component.querySelector(".player-container");
    const toastNotification = component.querySelector(".player-toast-notification");
    const video = component.querySelector(".content-video");
    const playOverlay = component.querySelector(".play-overlay");
    const loaderOverlay = component.querySelector(".loader-overlay");
    const loaderPercentage = component.querySelector(".loader-percentage");
    const bottomControlsWrapper = component.querySelector(".bottom-controls-wrapper");
    const settingsMenuContainer = component.querySelector(".settings-menu-container");
    const settingsGroup = component.querySelector(".settings-group");
    const shortcutsModalOverlay = component.querySelector(".shortcuts-modal-overlay");
    const shareOptions = component.querySelectorAll(".share-option");
    const ambientCanvas = component.querySelector(".ambient-canvas");
    const annotationsContainer = component.querySelector(".annotations-container");
    const ambientToggle = component.querySelector("#ambient-toggle");
    const hdrToggle = component.querySelector("#hdr-toggle");
    const colorEnhanceToggle = component.querySelector("#color-enhance-toggle");
    const hdrTag = component.querySelector(".hdr-tag");
    const colorEnhanceTag = component.querySelector(".color-enhance-tag");
    const annotationsToggle = component.querySelector("#annotations-toggle");
    const errorOverlay = component.querySelector(".player-error-overlay");
    const errorMessageEl = component.querySelector(".error-message");
    const errorRetryBtn = component.querySelector(".error-retry-btn");
    
    const showError = (msg) => {
        if (!errorOverlay || !errorMessageEl) return;
        errorMessageEl.textContent = msg;
        errorOverlay.classList.add("active");
        if (loaderOverlay) loaderOverlay.classList.remove("active");
        if (video) video.style.display = "none";
    };

    const hideError = () => {
        errorOverlay?.classList.remove("active");
        if (video) video.style.display = "block";
    };

    const handleVideoError = () => {
        if (!video || !video.error) return;
        
        let message = "An error occurred during playback.";
        
        // Auto fallback for CORS errors on standard video elements
        if (video.error.code === 4 && video.hasAttribute("crossOrigin")) {
            log("CORS error suspected. Removing crossOrigin attribute and retrying...");
            video.removeAttribute("crossOrigin");
            
            // Disable features that strictly require CORS
            if (ambientToggle) {
                ambientToggle.checked = false;
                ambientToggle.disabled = true;
                handleAmbientToggle();
            }
            if (colorEnhanceToggle) {
                colorEnhanceToggle.checked = false;
                colorEnhanceToggle.disabled = true;
                handleColorEnhanceToggle();
            }
            
            showToast("Falling back to standard streaming...");
            video.load();
            const playPromise = video.play();
            if (playPromise !== undefined) playPromise.catch(e => log('Fallback play error:', e));
            return;
        }

        switch (video.error.code) {
            case 1: message = "Video playback was aborted."; break;
            case 2: message = "A dynamic network error occurred while downloading the video."; break;
            case 3: message = "Video playback failed. This could be due to a corruption problem or browser compatibility issue."; break;
            case 4: message = "The video format is not supported or the source is unavailable. (Check if the link has expired or has CORS restrictions)"; break;
        }
        showError(message);
    };

    const retryPlayback = () => {
        hideError();
        if (hls) {
            hls.destroy();
            hls = null;
        }
        if (dashApp) {
            dashApp.reset();
            dashApp = null;
        }
        initStream();
    };

    errorRetryBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        retryPlayback();
    });

    video?.addEventListener("error", handleVideoError);
    
    const topCcBtn = component.querySelector("#top-cc-btn");
    const netSpeedText = component.querySelector("#network-speed-text");
    const topSleepTimer = component.querySelector("#top-sleep-timer");
    const sleepTimerCountdown = component.querySelector("#sleep-timer-countdown");
    const playerTooltip = component.querySelector(".player-tooltip");
    
    const showTooltip = (text, element) => {
        if (!playerTooltip || !text) return;
        playerTooltip.textContent = text;
        playerTooltip.classList.add("show");
        
        const rect = element.getBoundingClientRect();
        const playerRect = component.getBoundingClientRect();
        const left = (rect.left + rect.width / 2) - playerRect.left;
        playerTooltip.style.left = \`\${left}px\`;
        
        const bottom = isControlsVisible() ? 85 : 20;
        playerTooltip.style.bottom = \`\${bottom}px\`;
    };
    
    const hideTooltip = () => {
        playerTooltip?.classList.remove("show");
    };

    component.querySelectorAll("[data-tooltip]").forEach(el => {
        let tooltipTimer;
        let isLongPress = false;

        el.addEventListener("pointerenter", (e) => {
            if (e.pointerType === "mouse") {
                showTooltip(el.dataset.tooltip, el);
            }
        });
        
        el.addEventListener("pointerleave", (e) => {
            clearTimeout(tooltipTimer);
            hideTooltip();
        });

        el.addEventListener("pointerdown", (e) => {
            if (e.pointerType === "touch" || e.pointerType === "pen") {
                isLongPress = false;
                tooltipTimer = setTimeout(() => {
                    isLongPress = true;
                    showTooltip(el.dataset.tooltip, el);
                }, 500);
            }
        });

        el.addEventListener("pointerup", (e) => {
            if (e.pointerType !== "mouse") {
                clearTimeout(tooltipTimer);
                hideTooltip();
            }
        });
        
        el.addEventListener("pointercancel", (e) => {
            clearTimeout(tooltipTimer);
            hideTooltip();
        });

        el.addEventListener("contextmenu", (e) => {
            if (e.pointerType !== "mouse") {
                e.preventDefault();
            }
        });

        el.addEventListener("click", (e) => {
            if (isLongPress) {
                e.preventDefault();
                e.stopImmediatePropagation();
                isLongPress = false;
            }
        });
    });
    
    const showSubMenu = (menuName) => {
        if (window._isFlexAutoScrolling && !menuName) return;
        if (settingsMenuContainer) {
            settingsMenuContainer.className = "settings-menu-container glass-panel";
            if (menuName) { settingsMenuContainer.classList.add(menuName); }
        }
    };
    
    let toastTimeout;
    const showToast = (message) => {
        if (!toastNotification) return;
        clearTimeout(toastTimeout);
        toastNotification.textContent = message;
        toastNotification.classList.add("show");
        toastTimeout = setTimeout(() => { toastNotification.classList.remove("show"); }, 3000);
    };

    const updateSpeedUI = (speed) => {
        const speedBadge = component.querySelector("#speed-badge");
        if (speedBadge) {
            if (speed === 1) {
                speedBadge.style.display = "none";
            } else {
                speedBadge.style.display = "block";
                speedBadge.textContent = speed + "x";
            }
        }
    };

    const updateSettingsIconColor = (height) => {
        const settingsSvg = component.querySelector(".settings-btn svg");
        if (!settingsSvg) return;
        
        if (height === 'auto') {
            settingsSvg.style.color = "white";
        } else if (typeof height === 'number') {
            if (height >= 1080) {
                settingsSvg.style.color = "var(--brand)"; // Full HD
            } else if (height >= 720) {
                settingsSvg.style.color = "#4ade80"; // HD
            } else {
                settingsSvg.style.color = "#facc15"; // SD
            }
        } else {
            settingsSvg.style.color = "white"; // Default
        }
    };

    let _controlsVisible = false;
    let _controlsIdleTimeout;
    let _lastVisibilityChange = 0;

    const setControlsVisibility = (visible) => {
        if (!playerContainer) return;
        if (_controlsVisible === visible) return;
        _controlsVisible = visible;
        _lastVisibilityChange = Date.now();
        
        if (visible) {
            playerContainer.classList.add('controls-active');
            playerContainer.classList.add('is-active'); 
        } else {
            playerContainer.classList.remove('controls-active');
            playerContainer.classList.remove('is-active');
            settingsGroup?.classList.remove("is-open");
            showSubMenu();
        }
        
        component.dispatchEvent(new CustomEvent('flex:controls-visibility', {
            detail: { visible: visible },
            bubbles: true
        }));
    };

    const wakeControls = () => {
        if (!playbackHasStarted) return;
        setControlsVisibility(true);
        clearTimeout(_controlsIdleTimeout);
        playerContainer.style.cursor = 'default';
        if (video && !video.paused && !settingsGroup?.classList.contains("is-open") && !shortcutsModalOverlay?.classList.contains("is-visible")) {
            _controlsIdleTimeout = setTimeout(() => {
                if (video && !video.paused && !settingsGroup?.classList.contains("is-open")) {
                    setControlsVisibility(false);
                    playerContainer.style.cursor = 'none';
                }
            }, 5000);
        }
    };

    playerContainer?.addEventListener("mousemove", wakeControls);
    playerContainer?.addEventListener("mouseleave", () => {
        if (video && !video.paused) {
            // Add a small delay before hiding on mouse leave for smoother desktop experience
            clearTimeout(_controlsIdleTimeout);
            _controlsIdleTimeout = setTimeout(() => {
                setControlsVisibility(false);
                playerContainer.style.cursor = 'default';
            }, 1000);
        }
    });

    const isControlsVisible = () => _controlsVisible;

    let processAudioContextFrameId;
    let waveformAnimationFrameId;
    
    // Ambient Variables
    let ambientAnimationFrameId;
    const ambientCtx = ambientCanvas?.getContext('2d');
    
    const waveformCanvas = component.querySelector('.audio-waveform-canvas');
    const waveformCtx = waveformCanvas?.getContext('2d');
    const waveformToggle = component.querySelector('#waveform-toggle');
    const waveformContainer = component.querySelector('.audio-waveform-container');

    const drawAudioWaveform = () => {
        if (!waveformToggle?.checked || !analyser || !waveformCtx || !video || video.paused || video.ended) {
            if (waveformAnimationFrameId) cancelAnimationFrame(waveformAnimationFrameId);
            waveformAnimationFrameId = null;
            
            // clear canvas if not playing or disabled
            if (waveformCtx && waveformCanvas && (!video || video.paused || video.ended)) {
                waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
                // Draw flat line
                waveformCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                for (let i = 0; i < 5; i++) {
                    const barWidth = (waveformCanvas.width / 5) - 2;
                    waveformCtx.fillRect(i * (barWidth + 2), waveformCanvas.height / 2 - 1, barWidth, 2);
                }
            }
            return;
        }

        waveformAnimationFrameId = requestAnimationFrame(drawAudioWaveform);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

        // Draw 5 bars
        const numBars = 5;
        const barWidth = (waveformCanvas.width / numBars) - 2;
        let barHeight;
        
        // Take samples from dataArray
        const step = Math.floor(bufferLength / numBars);

        for (let i = 0; i < numBars; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
                sum += dataArray[i * step + j];
            }
            const avg = sum / step;
            
            // Scale to canvas height
            barHeight = (avg / 255) * waveformCanvas.height;
            if (barHeight < 2) barHeight = 2; // minimum height
            
            waveformCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const x = i * (barWidth + 2);
            const y = (waveformCanvas.height - barHeight) / 2; // Center vertically
            
            // Draw with rounded corners if possible, otherwise rect
            waveformCtx.beginPath();
            waveformCtx.roundRect(x, y, barWidth, barHeight, 2);
            waveformCtx.fill();
        }
    }

    const drawAmbientFrame = () => {
        if (!playerContainer?.classList.contains('is-ambient') || !video || video.paused || video.ended || !ambientCtx) {
            if (ambientAnimationFrameId) cancelAnimationFrame(ambientAnimationFrameId);
            ambientAnimationFrameId = null;
            return;
        }
        
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            try {
                if (ambientCanvas.width === 0) {
                    ambientCanvas.width = 160; 
                    ambientCanvas.height = 90;
                    ambientCanvas.style.display = 'block';
                }
                ambientCtx.drawImage(video, 0, 0, ambientCanvas.width, ambientCanvas.height);
            } catch (err) {
                if (IS_DEBUG_MODE) log("Ambient draw failed (likely CORS):", err);
            }
        }
        
        ambientAnimationFrameId = requestAnimationFrame(drawAmbientFrame);
    };
    
    const handleWaveformToggle = () => {
        if (!waveformToggle) return;
        const isEnabled = waveformToggle.checked;
        if (waveformContainer) waveformContainer.style.display = isEnabled ? "flex" : "none";
        try { localStorage.setItem("mpc-player-waveform", isEnabled); } catch(e){}
        
        if (isEnabled) {
            if (!audioCtx) setupAudioProcessing();
            if (!waveformAnimationFrameId && video && !video.paused) {
                waveformAnimationFrameId = requestAnimationFrame(drawAudioWaveform);
            }
        } else {
            if (waveformAnimationFrameId) {
                cancelAnimationFrame(waveformAnimationFrameId);
                waveformAnimationFrameId = null;
            }
        }
    };

    const handleAmbientToggle = () => {
        if (!ambientToggle) return;
        const isEnabled = ambientToggle.checked;
        component.classList.toggle('is-ambient', isEnabled);
        playerContainer?.classList.toggle('is-ambient', isEnabled);
        try { localStorage.setItem("mpc-player-ambient", isEnabled); } catch(e){}
        if (isEnabled && !ambientAnimationFrameId && video && !video.paused) {
            ambientAnimationFrameId = requestAnimationFrame(drawAmbientFrame);
        } else if (!isEnabled && ambientAnimationFrameId) {
            cancelAnimationFrame(ambientAnimationFrameId);
            ambientAnimationFrameId = null;
            setTimeout(() => { ambientCtx?.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height); }, 500);
        }
    };

    let colorEnhanceAnimationFrameId;
    let enhanceCanvas = document.createElement('canvas');
    let enhanceCtx = enhanceCanvas.getContext('2d', { willReadFrequently: true });

    const drawColorEnhanceFrame = () => {
        const isColorEnhance = video?.classList.contains('is-color-enhance');
        if (!isColorEnhance || !video || video.paused || video.ended) {
            if (colorEnhanceAnimationFrameId) cancelAnimationFrame(colorEnhanceAnimationFrameId);
            colorEnhanceAnimationFrameId = null;
            if (video && !video.classList.contains('is-hdr')) video.style.filter = '';
            else if (video && video.classList.contains('is-hdr')) video.style.filter = ''; // CSS class will apply
            return;
        }

        if (video.videoWidth > 0 && video.videoHeight > 0) {
            try {
                if (enhanceCanvas.width === 0) {
                    enhanceCanvas.width = 16;
                    enhanceCanvas.height = 9;
                }
                enhanceCtx.drawImage(video, 0, 0, 16, 9);
                const imgData = enhanceCtx.getImageData(0, 0, 16, 9);
                const data = imgData.data;
                let r = 0, g = 0, b = 0;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i]; g += data[i+1]; b += data[i+2];
                }
                let count = data.length / 4;
                r /= count; g /= count; b /= count;
                let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255; 

                const isHdr = video.classList.contains('is-hdr');
                let baseBrightness = isHdr ? 1.05 : 1.0;
                let baseContrast = isHdr ? 1.15 : 1.0;
                let baseSaturate = isHdr ? 1.5 : 1.4;

                let dynamicBright = baseBrightness + (0.5 - luminance) * 0.4;
                let dynamicContrast = baseContrast + (0.5 - luminance) * 0.2;
                let dynamicSaturate = baseSaturate + (luminance - 0.5) * 0.4;

                dynamicBright = Math.max(0.9, Math.min(1.4, dynamicBright));
                dynamicContrast = Math.max(1.0, Math.min(1.3, dynamicContrast));
                dynamicSaturate = Math.max(1.0, Math.min(2.0, dynamicSaturate));

                video.style.filter = "brightness(" + dynamicBright.toFixed(2) + ") contrast(" + dynamicContrast.toFixed(2) + ") saturate(" + dynamicSaturate.toFixed(2) + ")";
            } catch (err) {
                video.style.filter = '';
            }
        }
        
        colorEnhanceAnimationFrameId = requestAnimationFrame(drawColorEnhanceFrame);
    };

    const handleHdrToggle = () => {
        if (!hdrToggle) return;
        const isEnabled = hdrToggle.checked;
        if (video) {
            video.classList.toggle('is-hdr', isEnabled);
            video.style.filter = ''; 
        }
        if (hdrTag) {
            hdrTag.style.display = isEnabled ? 'inline-flex' : 'none';
        }
        try { localStorage.setItem("mpc-player-hdr", isEnabled); } catch(e){}
    };

    const handleColorEnhanceToggle = () => {
        if (!colorEnhanceToggle) return;
        const isEnabled = colorEnhanceToggle.checked;
        if (video) {
            video.classList.toggle('is-color-enhance', isEnabled);
            video.style.filter = '';
        }
        if (colorEnhanceTag) {
            colorEnhanceTag.style.display = isEnabled ? 'inline-flex' : 'none';
        }
        try { localStorage.setItem("mpc-player-color-enhance", isEnabled); } catch(e){}
        
        if (isEnabled && !colorEnhanceAnimationFrameId && video && !video.paused) {
            colorEnhanceAnimationFrameId = requestAnimationFrame(drawColorEnhanceFrame);
        } else if (!isEnabled && colorEnhanceAnimationFrameId) {
            cancelAnimationFrame(colorEnhanceAnimationFrameId);
            colorEnhanceAnimationFrameId = null;
        }
    };
    
    const annotationsData = ${JSON.stringify(annotations)};
    let activeAnnotations = new Set();
    const handleAnnotationsToggle = () => {
        if (!annotationsToggle) return;
        const isEnabled = annotationsToggle.checked;
        try { localStorage.setItem("mpc-player-annotations", isEnabled); } catch(e){}
        if (!isEnabled && annotationsContainer) {
            annotationsContainer.innerHTML = '';
            activeAnnotations.clear();
        }
    };
    
    const updateAnnotations = () => {
        if (!annotationsToggle?.checked || !video || !annotationsContainer || annotationsData.length === 0) return;
        const currentTime = video.currentTime;
        const nowVisibleIds = new Set();
        annotationsData.forEach(ann => {
            if (currentTime >= ann.start && currentTime < ann.end) {
                nowVisibleIds.add(ann.id);
                if (!activeAnnotations.has(ann.id)) {
                    const annEl = document.createElement('div');
                    annEl.className = \`annotation glass-panel position-\${ann.position || 'top-center'}\`;
                    annEl.id = \`\${componentId}-ann-\${ann.id}\`;
                    if (ann.url) { 
                        annEl.innerHTML = \`<a href="\${ann.url}" target="_blank" rel="noopener noreferrer">\${ann.text}</a>\`; 
                    } else { 
                        annEl.textContent = ann.text; 
                    }
                    annotationsContainer.appendChild(annEl);
                    setTimeout(() => annEl.classList.add('visible'), 10);
                    activeAnnotations.add(ann.id);
                }
            }
        });
        activeAnnotations.forEach(id => {
            if (!nowVisibleIds.has(id)) {
                const el = document.getElementById(\`\${componentId}-ann-\${id}\`);
                if (el) {
                    el.classList.remove('visible');
                    setTimeout(() => el.remove(), 300);
                }
                activeAnnotations.delete(id);
            }
        });
    };
    
    const playIconHTML = \`<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>\`;
    const pauseIconHTML = \`<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>\`;
    const IS_DEBUG_MODE = ${debug};
    const DEFAULT_SPEED = 1;
    console.log("MPC INITIAL PLAYBACK RATE DEBUG:", DEFAULT_SPEED);
    if (video) video.playbackRate = DEFAULT_SPEED;
    
    const log = (message, data = "") => { 
        if (IS_DEBUG_MODE) {
            console.log(\`[MPC|\${componentId}]: \`, message, data); 
            try {
                let serializedData = data;
                if (data && typeof data === 'object') {
                    try { serializedData = JSON.stringify(data); } catch(e) { serializedData = String(data); }
                }
                const logUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL + 'api/log' : API_BASE_URL + '/api/log';
                fetch(logUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: \`[MPC|\${componentId}]: \${message}\`, data: serializedData })
                }).catch(()=>{});
            } catch(e) {}
        }
    };
    
    const adSchedule = ${JSON.stringify(ads)};
    
    const adContainer = component.querySelector(".ad-container");
    const adVideo = component.querySelector(".ad-video");
    const adClickThrough = component.querySelector(".ad-click-through");
    const adIndicator = component.querySelector(".ad-indicator");
    const adSkipBtn = component.querySelector(".ad-skip-btn");
    const playbackPulse = component.querySelector(".playback-pulse");
    const fullscreenTitle = component.querySelector(".fullscreen-title-overlay");
    const gestureIndicators = { left: component.querySelector(".gesture-indicator.left"), right: component.querySelector(".gesture-indicator.right") };
    const volumeIndicator = component.querySelector(".volume-indicator");
    const volumeLevel = component.querySelector(".volume-level");
    const loopToggle = component.querySelector("#loop-toggle");
    const speedNav = component.querySelector('[data-target-menu="speed"]');
    const qualityNav = component.querySelector('[data-target-menu="quality"]');
    const shareNav = component.querySelector('[data-target-menu="share"]');
    const subtitlesNav = component.querySelector('[data-target-menu="subtitles"]');
    const sleepNav = component.querySelector('[data-target-menu="sleep"]');
    const configurationNav = component.querySelector('[data-target-menu="configuration"]');
    const backBtns = component.querySelectorAll(".submenu-back-btn");
    const speedOptions = component.querySelectorAll(".speed-option");
    const currentSpeedLabel = component.querySelector("#current-speed-label");
    const currentQualityLabel = component.querySelector("#current-quality-label");
    const currentSubtitleLabel = component.querySelector("#current-subtitle-label");
    const currentSleepLabel = component.querySelector("#current-sleep-label");
    const qualityMenuList = component.querySelector("#quality-menu-list");
    const subtitlesMenuList = component.querySelector("#subtitles-menu-list");
    const sleepOptions = component.querySelectorAll(".sleep-option");
    const stableVolumeToggle = component.querySelector("#stable-volume-toggle");
    const networkStatusPopup = component.querySelector(".network-status-popup");
    const networkSpeedIndicator = component.querySelector("#network-speed-indicator");
    
    topCcBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!isControlsVisible()) return;
        settingsGroup?.classList.add("is-open");
        showSubMenu("show-subtitles");
    });

    let baseNetworkSpeed = (navigator.connection && navigator.connection.downlink) ? navigator.connection.downlink * 125 : 850; 
    setInterval(() => {
        if(!netSpeedText || !video || video.paused) return;
        let currentSpeed = baseNetworkSpeed + (Math.random() * 80 - 40); 
        netSpeedText.textContent = \`\${Math.max(0, currentSpeed).toFixed(0)} KB/s\`;
    }, 1500);

    class AdManager {
        constructor() {
            this.schedule = adSchedule.map(ad => ({ ...ad, played: false }));
            this.currentAd = null;
            this.isAdPlaying = false;
            adVideo?.addEventListener("ended", () => this.endCurrentAd());
            adVideo?.addEventListener("timeupdate", () => this.updateAdUI());
            adVideo?.addEventListener("waiting", () => { if (!adVideo.paused && loaderOverlay) loaderOverlay.classList.add("active"); });
            adVideo?.addEventListener("playing", () => { if (loaderOverlay) loaderOverlay.classList.remove("active"); });
            adVideo?.addEventListener("error", (e) => {
                log("Ad Video playback error", adVideo.error);
                showToast("Ad playback error. Skipping ad...");
                this.endCurrentAd();
            });
            adVideo?.addEventListener("progress", () => {
                if (!this.isAdPlaying || !adVideo || !isFinite(adVideo.duration)) return;
                const buffer = adVideo.buffered;
                // removed percentage buffering update logic
            });
            adSkipBtn?.addEventListener("click", (e) => { e.stopPropagation(); this.endCurrentAd(); });
        }
        playAd(ad) {
            if (this.isAdPlaying || !adVideo) return;
            this.isAdPlaying = true;
            this.currentAd = ad;
            ad.played = true;
            if (video) video.pause();
            if (bottomControlsWrapper) bottomControlsWrapper.style.display = "none";
            if (loaderOverlay) loaderOverlay.classList.add("active");
            if (adContainer) adContainer.style.display = "block";
            if (adClickThrough) adClickThrough.href = ad.clickUrl;
            adVideo.src = ad.videoSrc;
            adVideo.play().catch(err => {
                log("Ad playback play() call failed", err);
                showToast("Failed to start ad. Skipping...");
                this.endCurrentAd();
            });
        }
        endCurrentAd() {
            if (!this.isAdPlaying || !adVideo) return;
            this.isAdPlaying = false;
            this.currentAd = null;
            adVideo.src = "";
            if (adContainer) adContainer.style.display = "none";
            if (adSkipBtn) adSkipBtn.style.display = "none";
            if (bottomControlsWrapper) bottomControlsWrapper.style.display = "";
            if (loaderOverlay) loaderOverlay.classList.remove("active");
            if (video) video.play().catch(err => log("Content resume failed", err));
        }
        checkForMidroll(currentTime) {
            if (this.isAdPlaying) return;
            const adToPlay = this.schedule.find(ad => ad.type === 'midroll' && !ad.played && currentTime >= ad.timeOffset);
            if (adToPlay) { this.playAd(adToPlay); }
        }
        updateAdUI() {
            if (!this.currentAd || !adVideo || !adIndicator) return;
            const skipOffset = this.currentAd.skipOffset;
            const videoDuration = Number.isFinite(adVideo.duration) ? adVideo.duration : 0;
            const timeLeft = Math.max(0, Math.ceil(videoDuration - adVideo.currentTime));
            
            const indicatorText = adIndicator.querySelector('.ad-indicator-text') || adIndicator;

            if (skipOffset && adVideo.currentTime < skipOffset) {
                const skipTimeLeft = Math.ceil(skipOffset - adVideo.currentTime);
                indicatorText.textContent = \`Skip in \${skipTimeLeft}s\`;
            } else {
                indicatorText.textContent = \`Ad - \${timeLeft}s\`;
            }

            if (skipOffset && adVideo.currentTime >= skipOffset && adSkipBtn) {
                adSkipBtn.style.display = "flex";
                adIndicator.style.display = "none";
            } else {
                if (adSkipBtn) adSkipBtn.style.display = "none";
                adIndicator.style.display = "flex";
            }
        }
    }
    const adManager = new AdManager();
    
    const triggerPulse = (iconHTML) => {
        if (!playbackPulse) return;
        playbackPulse.innerHTML = iconHTML;
        playbackPulse.classList.add("animate");
        setTimeout(() => playbackPulse.classList.remove("animate"), 500);
    };
    
    let skipAccumulators = { left: 0, right: 0 };
    let skipTimeouts = { left: null, right: null };

    const triggerGesture = (direction) => {
        const indicator = gestureIndicators[direction];
        if (!indicator) return;
        
        skipAccumulators[direction] += 10;
        const textSpan = indicator.querySelector("span");
        if (textSpan) {
            textSpan.textContent = (direction === 'left' ? '-' : '+') + skipAccumulators[direction] + "s";
        }
        
        indicator.classList.remove("animate");
        void indicator.offsetWidth;
        indicator.classList.add("animate");
        
        if (skipTimeouts[direction]) clearTimeout(skipTimeouts[direction]);
        skipTimeouts[direction] = setTimeout(() => {
            indicator.classList.remove("animate");
            skipAccumulators[direction] = 0;
            if (textSpan) {
                 textSpan.textContent = (direction === 'left' ? '-10s' : '+10s');
            }
        }, 600);
    };
    
    let lastTap = 0, touchStartY, isVolumeSwipe = false, volumeTimeout, clickTimeout, statsInterval, sleepTimer;
    
    playerContainer?.addEventListener("touchstart", (e) => {
        if (adManager.isAdPlaying || !playerContainer) return;
        const touch = e.touches[0];
        if (touch.clientX - playerContainer.getBoundingClientRect().left > playerContainer.clientWidth / 2) {
            isVolumeSwipe = true;
            touchStartY = touch.clientY;
        }
    }, { passive: true });
    
    playerContainer?.addEventListener("touchmove", (e) => {
        if (!isVolumeSwipe || !playerContainer || !video) return;
        e.preventDefault();
        const newY = e.touches[0].clientY;
        const deltaY = (touchStartY - newY) / playerContainer.clientHeight;
        let newVolume = video.volume + deltaY;
        newVolume = Math.max(0, Math.min(1, newVolume));
        video.volume = newVolume;
        if (volumeLevel) volumeLevel.style.height = \`\${newVolume * 100}%\`;
        if (volumeIndicator) volumeIndicator.classList.add("active");
        touchStartY = newY;
        clearTimeout(volumeTimeout);
        volumeTimeout = setTimeout(() => { if (volumeIndicator) volumeIndicator.classList.remove("active"); }, 1000);
    });
    
    playerContainer?.addEventListener("touchend", () => {
        isVolumeSwipe = false;
        clearTimeout(volumeTimeout);
        volumeTimeout = setTimeout(() => { if (volumeIndicator) volumeIndicator.classList.remove("active"); }, 500);
    });

    playerContainer?.addEventListener("wheel", (e) => {
        if (adManager.isAdPlaying || !video) return;
        
        // Only trigger volume change if mouse is actually over the player 
        // and we are either in a state where controls are visible or we want to wake them.
        e.preventDefault();
        wakeControls();
        
        let newVolume = video.volume + (e.deltaY > 0 ? -0.05 : 0.05);
        newVolume = Math.max(0, Math.min(1, newVolume));
        video.volume = newVolume;
        
        if (volumeLevel) volumeLevel.style.height = \`\${newVolume * 100}%\`;
        if (volumeIndicator) volumeIndicator.classList.add("active");
        
        clearTimeout(volumeTimeout);
        volumeTimeout = setTimeout(() => { 
            if (volumeIndicator) volumeIndicator.classList.remove("active"); 
        }, 1000);
    }, { passive: false });
    
    playerContainer?.addEventListener("click", (e) => {
        if (adManager.isAdPlaying || !playerContainer || !video) return;
        
        // Focus the component to ensure keyboard shortcuts work
        component.focus();
        wakeControls();
        
        // If clicking a button or menu, don't trigger play/pause overlay logic
        if (e.target.closest('button') || e.target.closest('.settings-menu-container') || e.target.closest('.seek-bar-container')) {
            return;
        }

        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        } else {
            clickTimeout = setTimeout(() => {
                clickTimeout = null;
                // If actively loading, don't toggle pause to prevent cancelling the loading state.
                if (loaderOverlay && loaderOverlay.classList.contains('active')) {
                    return;
                }
                // Toggle Play/Pause on single click
                if (video.paused) {
                    video.play().catch(e => log("Play interrupted", e));
                } else {
                    video.pause();
                }
                triggerPulse(video.paused ? pauseIconHTML : playIconHTML);
            }, 250);
        }
    });

    // Handle double clicks for skips (left/right) and fullscreen (center)
    playerContainer?.addEventListener("dblclick", (e) => {
        if (adManager.isAdPlaying || !playerContainer || !video) return;
        
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        }

        if (e.target.closest('button') || e.target.closest('.settings-menu-container') || e.target.closest('.seek-bar-container')) {
            return;
        }

        const tapX = e.offsetX;
        const playerWidth = playerContainer.offsetWidth;
        const leftZone = playerWidth * 0.3;
        const rightZone = playerWidth * 0.7;

        if (tapX < leftZone) {
            // Double clicked left side - Skip back
            video.currentTime -= 10;
            triggerGesture("left");
        } else if (tapX > rightZone) {
            // Double clicked right side - Skip forward
            video.currentTime += 10;
            triggerGesture("right");
        } else {
            // Double clicked center - Fullscreen toggle
            if (document.fullscreenElement) document.exitFullscreen();
            else component.requestFullscreen().catch(err => log("Fullscreen failed:", err));
        }
        
        // Note: Two click events already fired, so play/pause was toggled twice (net zero change).
    });
    
    let audioCtx, audioSource, compressor, analyser;
    let isWaveformEnabled = true;
    const isStableVolumeCompatible = () => {
        if (!video || !video.src) return true;
        try {
            const target = new URL(video.src, window.location.origin);
            if (target.origin !== window.location.origin && (!video.crossOrigin || video.crossOrigin === 'null')) {
                return false;
            }
            return true;
        } catch(e) { return false; }
    };

    const updateStableVolumeUI = () => {
        if (!c.stableVolume || !stableVolumeToggle) return;
        const row = stableVolumeToggle.closest('.menu-item');
        if (!row) return;

        const supported = isStableVolumeCompatible();
        row.style.display = supported ? "" : "none";
        if (!supported && stableVolumeToggle.checked) {
            stableVolumeToggle.checked = false;
            toggleStableVolume(false);
        }
    };

    video?.addEventListener('canplay', () => {
        updateStableVolumeUI();
        if (loaderOverlay) loaderOverlay.classList.remove("active");
    });
    
    const setupAudioProcessing = async () => {
        if (!video) return false;
        if (audioCtx) {
            if (audioCtx.state === 'suspended') await audioCtx.resume().catch(() => {});
            return true;
        }
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            audioSource = audioCtx.createMediaElementSource(video);
            compressor = audioCtx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
            compressor.knee.setValueAtTime(40, audioCtx.currentTime);
            compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
            compressor.attack.setValueAtTime(0, audioCtx.currentTime);
            compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
            
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 32;
            
            audioSource.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            return true;
        } catch(err) { 
            log("Stable Volume not supported for this source:", err); 
            const row = stableVolumeToggle?.closest('.menu-item');
            if (row) row.style.display = "none";
            return false;
        }
    };

    // Remove the previous canplay listener if it existed (cleaner)
    // Actually we'll just incorporate it into the main logic.
    
    const toggleStableVolume = async (isEnabled) => {
        if (isEnabled) {
            if (!isStableVolumeCompatible()) {
                const row = stableVolumeToggle?.closest('.menu-item');
                if (row) row.style.display = "none";
                if (stableVolumeToggle) stableVolumeToggle.checked = false;
                return;
            }
            if (!audioCtx) {
                const success = await setupAudioProcessing();
                if (!success) {
                    const row = stableVolumeToggle?.closest('.menu-item');
                    if (row) row.style.display = "none";
                    return;
                }
            }
        }
        if (!audioCtx || !audioSource) return;
        
        audioSource.disconnect();
        compressor.disconnect();
        analyser.disconnect();
        if (isEnabled) {
            audioSource.connect(compressor);
            compressor.connect(analyser);
            analyser.connect(audioCtx.destination);
        } else {
            audioSource.connect(analyser);
            analyser.connect(audioCtx.destination);
        }
        
        if (audioCtx.state === 'suspended') await audioCtx.resume().catch(() => {});
    };

    const resumeAudio = async () => {
        if (audioCtx && audioCtx.state === 'suspended') {
            await audioCtx.resume().catch(() => {});
        }
    };

    video?.addEventListener('play', resumeAudio);
    playerContainer?.addEventListener('click', resumeAudio, { once: false });
    playerContainer?.addEventListener('touchstart', resumeAudio, { once: false });
    
    const initializeControls = () => {
        log("Initializing Controls...");
        const playPauseBtn = component.querySelector(".play-pause-btn");
        const muteBtn = component.querySelector(".mute-btn");
        const fullscreenBtn = component.querySelector(".fullscreen-btn");
        const seekBar = component.querySelector(".seek-bar");
        const timeDisplay = component.querySelector(".time-display");
        const durationDisplay = component.querySelector(".duration-display");
        const pipBtn = component.querySelector(".pip-btn");
        const mobileMuteBtn = component.querySelector("#mobile-mute-btn");
        const mobileMuteToggle = component.querySelector("#mobile-mute-toggle");
        if (mobileMuteToggle) {
            if(video) mobileMuteToggle.checked = video.muted || video.volume === 0;
            // Removed preventDefault here to allow native toggle
        }
        const mobilePipBtn = component.querySelector("#mobile-pip-btn");
        const mobilePipToggle = component.querySelector("#mobile-pip-toggle");
        if (mobilePipToggle) {
            if(document.pictureInPictureElement) mobilePipToggle.checked = true;
            // Removed preventDefault here to allow native toggle
        }
        const settingsBtn = component.querySelector(".settings-btn");
        const seekPreview = component.querySelector(".seek-preview");
        const seekPreviewTime = component.querySelector(".seek-preview-time");
        const seekBarProgress = component.querySelector(".seek-bar-progress");
        const seekBarBuffer = component.querySelector(".seek-bar-buffer");
        const shortcutsMenuBtn = component.querySelector("#shortcuts-menu-btn");
        const shortcutsCloseBtn = component.querySelector(".shortcuts-close-btn");
        
        // --- 3D Roller Setup ---
        const setupRollers = () => {
            const rollerUls = component.querySelectorAll(".settings-menu:not(.main-menu) ul");
            rollerUls.forEach(ul => {
                const update = () => {
                    const items = ul.querySelectorAll(".menu-item");
                    if (items.length === 0) return;
                    
                    // Set padding dynamically so the first and last item can reach the exact center
                    const halfH = ul.clientHeight / 2;
                    if (ul.style.paddingTop !== (halfH - 22) + "px") {
                        ul.style.paddingTop = (halfH - 22) + "px"; // 22 is ~half of item height
                        ul.style.paddingBottom = (halfH - 22) + "px";
                    }
                    
                    const containerCenter = ul.clientHeight / 2;
                    const radius = ul.clientHeight / 2 || 100;

                    items.forEach(item => {
                        // Use offsetTop instead of getBoundingClientRect() to avoid CSS transform feedback loops
                        // Since 'ul' is position: relative, item.offsetTop is relative to 'ul'
                        const visualItemCenter = item.offsetTop + (item.offsetHeight / 2) - ul.scrollTop;
                        const distance = visualItemCenter - containerCenter;

                        // Calculate angle: map distance to degrees (e.g. max -60 to 60)
                        let rawAngle = (distance / radius) * -55; // Notice the negative to make it roll correctly
                        const angle = Math.max(-70, Math.min(70, rawAngle)); 

                        // Scale goes down slightly towards the edges
                        const scale = Math.max(0.75, 1 - Math.abs(distance / radius) * 0.25);
                        
                        // Opacity reduces towards edges
                        const opacity = Math.max(0.2, 1 - Math.abs(distance / radius) * 0.8);
                        
                        // Apply CSS vars
                        item.style.setProperty('--rot', angle + "deg");
                        item.style.setProperty('--s', scale);
                        item.style.setProperty('--op', opacity);
                        item.style.setProperty('--ty', "0px"); // Removed ty offset to avoid drifting
                    });
                };
                
                let scrollTimeout;
                // Add scroll listener
                ul.addEventListener("scroll", () => {
                    requestAnimationFrame(update);
                    
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        if (!settingsGroup?.classList.contains("is-open")) return;
                        if (!ul.clientHeight || ul.clientHeight === 0) return;
                        if (ul.closest('.share-menu') || ul.closest('.custom-sleep-menu')) return;
                        
                        let closestItem = null;
                        let minDistance = Infinity;
                        const containerCenter = ul.clientHeight / 2;
                        const items = ul.querySelectorAll(".menu-item");
                        
                        items.forEach(item => {
                            if (item.style.display === 'none') return;
                            const visualItemCenter = item.offsetTop + (item.offsetHeight / 2) - ul.scrollTop;
                            const distance = Math.abs(visualItemCenter - containerCenter);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestItem = item;
                            }
                        });
                        
                        if (closestItem && !closestItem.classList.contains("active")) {
                            window._isFlexAutoScrolling = true;
                            closestItem.click();
                            window._isFlexAutoScrolling = false;
                        }
                    }, 150);
                }, { passive: true });
                
                // Initial update on next frame to ensure DOM is ready
                requestAnimationFrame(update);
                
                // Also update when submenu is shown
                const observer = new IntersectionObserver((entries) => {
                    if(entries[0].isIntersecting) {
                        requestAnimationFrame(update);
                        // Optional: Center the selected item? (Could add logic here)
                    }
                });
                observer.observe(ul);
            });
        };
        setupRollers();

        const formatTime = (timeInSeconds) => {
            const minutes = Math.floor(timeInSeconds / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            return \`\${minutes}:\${seconds.toString().padStart(2, '0')}\`;
        };
        
        const toggleShortcutsModal = (forceShow) => {
            if (!shortcutsModalOverlay) return;
            const isVisible = shortcutsModalOverlay.classList.contains('is-visible');
            if (forceShow === true) {
                shortcutsModalOverlay.style.display = 'flex';
                setTimeout(() => shortcutsModalOverlay.classList.add('is-visible'), 10);
            } else if (forceShow === false || isVisible) {
                shortcutsModalOverlay.classList.remove('is-visible');
                setTimeout(() => shortcutsModalOverlay.style.display = 'none', 300);
            } else {
                shortcutsModalOverlay.style.display = 'flex';
                setTimeout(() => shortcutsModalOverlay.classList.add('is-visible'), 10);
            }
        };
        
        shortcutsMenuBtn?.addEventListener("click", (e) => { e.stopPropagation(); settingsGroup?.classList.remove("is-open"); toggleShortcutsModal(true); });
        shortcutsCloseBtn?.addEventListener("click", () => toggleShortcutsModal(false));
        shortcutsModalOverlay?.addEventListener("click", (e) => { if (e.target === shortcutsModalOverlay) { toggleShortcutsModal(false); } });
        
        const toggleSettingsMenu = () => {
            if (!settingsGroup || !settingsMenuContainer || !playerContainer) return;
            const isOpen = settingsGroup.classList.toggle("is-open");
            if (isOpen) {
                if (playerContainer.getBoundingClientRect().top < settingsMenuContainer.offsetHeight) {
                    settingsMenuContainer.classList.add("opens-downward");
                } else {
                    settingsMenuContainer.classList.remove("opens-downward");
                }
            }
            if (typeof wakeControls === 'function') wakeControls();
        };
        
        settingsBtn?.addEventListener("click", (e) => { 
            e.stopPropagation(); 
            if (!isControlsVisible()) return;
            toggleSettingsMenu(); 
        });

        settingsBtn?.addEventListener("contextmenu", (e) => {
            e.preventDefault(); e.stopPropagation();
        });
        
        try {
            if (loopToggle && localStorage.getItem("mpc-player-loop") === "true") { loopToggle.checked = true; video.loop = true; }
            if (waveformToggle) { const sw = localStorage.getItem("mpc-player-waveform"); waveformToggle.checked = (sw === null || sw === "true"); handleWaveformToggle(); }
            if (ambientToggle) {
                const savedAmbient = localStorage.getItem("mpc-player-ambient");
                const ambientConfigEnabled = AMBIENT_CONFIG && (AMBIENT_CONFIG.enabled === true || AMBIENT_CONFIG.enabled === 'true');
                
                if (ambientConfigEnabled) {
                    // Force enable if config says so, unless it's explicitly saved as false by the user in this session
                    ambientToggle.checked = true;
                } else if (savedAmbient === "true") {
                    ambientToggle.checked = true;
                } else if (savedAmbient === null && AMBIENT_CONFIG) {
                    ambientToggle.checked = true; 
                }
            }
            if (hdrToggle) { const sh = localStorage.getItem("mpc-player-hdr"); hdrToggle.checked = (sh === "true"); handleHdrToggle(); }
            if (colorEnhanceToggle) { const sc = localStorage.getItem("mpc-player-color-enhance"); colorEnhanceToggle.checked = (sc === "true"); handleColorEnhanceToggle(); }
            if (annotationsToggle) { const sa = localStorage.getItem("mpc-player-annotations"); annotationsToggle.checked = (sa === null || sa === "true"); }
            if (video) {
                const sv = localStorage.getItem("mpc-player-volume"); if (sv !== null) video.volume = parseFloat(sv);
                const sm = localStorage.getItem("mpc-player-muted"); if (sm !== null) video.muted = (sm === "true");
            }
            if (stableVolumeToggle) {
                const isStableEnabled = localStorage.getItem("mpc-player-stable-volume") === "true";
                stableVolumeToggle.checked = isStableEnabled;
                if (isStableEnabled) {
                    video?.addEventListener('play', () => {
                        if (stableVolumeToggle.checked && isStableVolumeCompatible()) {
                            toggleStableVolume(true);
                        } else if (stableVolumeToggle.checked) {
                            stableVolumeToggle.checked = false;
                        }
                    }, { once: true });
                }
            }
            if (adVideo && video) { adVideo.volume = video.volume; adVideo.muted = video.muted; }
            if (volumeLevel && video) volumeLevel.style.height = \`\${video.volume * 100}%\`;
            handleAmbientToggle();
            handleAnnotationsToggle();
        } catch (e) { log("Could not access localStorage."); }
        
        loopToggle?.addEventListener("input", () => { if(video) video.loop = loopToggle.checked; try { localStorage.setItem("mpc-player-loop", video.loop); } catch (e) {} });
        waveformToggle?.addEventListener("input", handleWaveformToggle);
        ambientToggle?.addEventListener("input", handleAmbientToggle);
        hdrToggle?.addEventListener("input", handleHdrToggle);
        colorEnhanceToggle?.addEventListener("input", handleColorEnhanceToggle);
        annotationsToggle?.addEventListener("input", handleAnnotationsToggle);
        stableVolumeToggle?.addEventListener("input", () => { setupAudioProcessing(); toggleStableVolume(stableVolumeToggle.checked); try { localStorage.setItem("mpc-player-stable-volume", stableVolumeToggle.checked); } catch (e) {} });
        
        component.querySelectorAll('.menu-item').forEach(item => {
            const toggle = item.querySelector('.toggle-switch input');
            if (toggle) {
                item.addEventListener('click', (e) => {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
                    if (item.id === "mobile-mute-btn" || item.id === "mobile-pip-btn") {
                        // These have their own dedicated event listeners
                        return;
                    }
                    e.stopPropagation();
                    toggle.checked = !toggle.checked;
                    toggle.dispatchEvent(new Event("input"));
                });
            }
        });
        
        const updateStats = () => {};
        
        if ("pictureInPictureEnabled" in document) {
            if (pipBtn) pipBtn.style.display = "";
            // Do not hide mobilePipBtn by default, but it's safe to assume it's shown if "pictureInPictureEnabled" is supported.
            
            const handlePipClick = (e) => {
                e.stopPropagation();
                if (e.target.tagName === 'LABEL') return;
                if (adManager.isAdPlaying || !video) return;
                try { if (document.pictureInPictureElement) document.exitPictureInPicture(); else video.requestPictureInPicture(); } catch (err) {}
            };
            
            pipBtn?.addEventListener("click", handlePipClick);
            mobilePipBtn?.addEventListener("click", handlePipClick);

            video?.addEventListener("enterpictureinpicture", () => {
                pipBtn?.classList.add("is-pip");
                mobilePipBtn?.classList.add("is-pip");
                if (mobilePipToggle) mobilePipToggle.checked = true;
            });
            video?.addEventListener("leavepictureinpicture", () => {
                pipBtn?.classList.remove("is-pip");
                mobilePipBtn?.classList.remove("is-pip");
                if (mobilePipToggle) mobilePipToggle.checked = false;
            });
        } else {
            // Hide if not supported
            if (pipBtn) pipBtn.style.display = "none";
            if (mobilePipBtn) mobilePipBtn.style.display = "none";
        }
        
        speedNav?.addEventListener("click", e => { e.stopPropagation(); showSubMenu("show-speed"); });
        qualityNav?.addEventListener("click", e => { e.stopPropagation(); showSubMenu("show-quality"); });
        shareNav?.addEventListener("click", e => { e.stopPropagation(); showSubMenu("show-share"); });
        subtitlesNav?.addEventListener("click", e => { e.stopPropagation(); showSubMenu("show-subtitles"); });
        sleepNav?.addEventListener("click", e => { e.stopPropagation(); showSubMenu("show-sleep"); });
        configurationNav?.addEventListener("click", e => { e.stopPropagation(); showSubMenu("show-configuration"); });
        
        backBtns?.forEach(btn => btn?.addEventListener("click", e => { e.stopPropagation(); showSubMenu(); }));
        
        speedOptions?.forEach(option => {
            if(!video) return;
            const speed = parseFloat(option.dataset.speed);
            if (speed === video.playbackRate) { option.classList.add("active"); if (currentSpeedLabel) currentSpeedLabel.textContent = option.textContent; updateSpeedUI(speed); }
            option?.addEventListener("click", e => { 
                e.stopPropagation(); 
                video.playbackRate = speed; 
                if (typeof hls !== 'undefined' && hls) {
                    hls.config.abrBandWidthFactor = 0.95 / speed;
                    hls.config.abrBandWidthUpFactor = 0.7 / speed;
                }
                if(currentSpeedLabel) currentSpeedLabel.textContent = option.textContent; 
                updateSpeedUI(speed);
                speedOptions.forEach(opt => opt.classList.remove("active")); 
                option.classList.add("active"); 
                showSubMenu(); 
            });
        });
        
        shareOptions?.forEach(option => {
            option?.addEventListener("click", e => {
                e.stopPropagation();
                const platform = option.dataset.platform;
                const flexPlayerNode = component.closest('.flex-player, .media-player-embed');
                const dynShareUrl = flexPlayerNode?.dataset?.shareUrl;
                const dynShareText = flexPlayerNode?.dataset?.shareText;
                const finalShareUrl = dynShareUrl || ${JSON.stringify(shareUrl)} || window.location.href;
                const finalShareText = dynShareText || ${JSON.stringify(shareText)} || \`Check out this video on FlexPlayer!\`;
                
                if (platform === 'twitter') {
                    window.open(\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(finalShareUrl)}&text=\${encodeURIComponent(finalShareText)}\`, '_blank');
                } else if (platform === 'facebook') {
                    window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(finalShareUrl)}\`, '_blank');
                } else if (platform === 'whatsapp') {
                    window.open(\`https://wa.me/?text=\${encodeURIComponent(finalShareText + ' ' + finalShareUrl)}\`, '_blank');
                } else if (platform === 'linkedin') {
                    window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(finalShareUrl)}\`, '_blank');
                } else if (platform === 'email') {
                    window.location.href = \`mailto:?subject=\${encodeURIComponent(finalShareText)}&body=\${encodeURIComponent(finalShareUrl)}\`;
                } else if (platform === 'copy') {
                    navigator.clipboard.writeText(finalShareUrl).then(() => {
                        showToast("Link copied to clipboard!");
                    });
                }
                showSubMenu();
                settingsGroup?.classList.remove("is-open");
            });
        });
        
        const addCustomSleepBtn = component.querySelector("#add-custom-sleep-btn");
        const backToSleepBtn = component.querySelector(".back-to-sleep-btn");
        const customSleepSubmit = component.querySelector("#custom-sleep-submit");
        const rollerHours = component.querySelector("#roller-hours");
        const rollerMinutes = component.querySelector("#roller-minutes");
        const rollerSeconds = component.querySelector("#roller-seconds");
        
        if (rollerHours) {
             let hHTML = ''; for(let i=0; i<=23; i++) hHTML += \`<li class="menu-item sleep-custom-option" data-val="\${i}">\${i.toString().padStart(2, '0')}</li>\`;
             rollerHours.innerHTML = hHTML;
        }
        if (rollerMinutes) {
             let mHTML = ''; for(let i=0; i<=59; i++) mHTML += \`<li class="menu-item sleep-custom-option" data-val="\${i}">\${i.toString().padStart(2, '0')}</li>\`;
             rollerMinutes.innerHTML = mHTML;
        }
        if (rollerSeconds) {
             let sHTML = ''; for(let i=0; i<=59; i++) sHTML += \`<li class="menu-item sleep-custom-option" data-val="\${i}">\${i.toString().padStart(2, '0')}</li>\`;
             rollerSeconds.innerHTML = sHTML;
        }

        let sleepTimerInterval;
        let sleepEndTime = 0;
        
        const setSleepTimer = (timeInSeconds, label) => {
             clearTimeout(sleepTimer); clearInterval(sleepTimerInterval);
             if (timeInSeconds > 0) { 
                 sleepEndTime = Date.now() + timeInSeconds * 1000;
                 if(topSleepTimer) topSleepTimer.style.display = "flex";
                 showToast(\`Sleep timer set to \${label}\`);
                 const updateCountdown = () => {
                     const remaining = Math.max(0, Math.floor((sleepEndTime - Date.now()) / 1000));
                     const m = Math.floor(remaining / 60); const s = remaining % 60;
                     if(sleepTimerCountdown) sleepTimerCountdown.textContent = \`\${m}:\${s.toString().padStart(2, '0')}\`;
                     if (remaining <= 0) { clearInterval(sleepTimerInterval); if(topSleepTimer) topSleepTimer.style.display = "none"; }
                 };
                 updateCountdown(); sleepTimerInterval = setInterval(updateCountdown, 1000);
                 sleepTimer = setTimeout(() => { if(video) video.pause(); triggerPulse(pauseIconHTML); }, timeInSeconds * 1000); 
             } else { if(topSleepTimer) topSleepTimer.style.display = "none"; }
             if (currentSleepLabel) currentSleepLabel.textContent = label;
             showSubMenu();
        };

        sleepOptions?.forEach(option => {
            option?.addEventListener("click", e => {
                e.stopPropagation();
                const timeInSeconds = parseInt(option.dataset.time, 10);
                setSleepTimer(timeInSeconds, option.textContent);
            });
        });
        
        if (addCustomSleepBtn) {
            addCustomSleepBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                showSubMenu("show-custom-sleep");
            });
        }
        
        if (backToSleepBtn) {
            backToSleepBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                showSubMenu("show-sleep");
            });
        }
        
        if (customSleepSubmit) {
            customSleepSubmit.addEventListener("click", (e) => {
                e.stopPropagation();
                
                const getRollerValue = (ulElement) => {
                    if (!ulElement) return 0;
                    const containerCenter = ulElement.clientHeight / 2;
                    let closestItem = null;
                    let minDistance = Infinity;
                    
                    const items = ulElement.querySelectorAll(".menu-item");
                    items.forEach(item => {
                        const visualItemCenter = item.offsetTop + (item.offsetHeight / 2) - ulElement.scrollTop;
                        const distance = Math.abs(visualItemCenter - containerCenter);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestItem = item;
                        }
                    });
                    return closestItem ? parseInt(closestItem.dataset.val, 10) : 0;
                };
                
                const h = getRollerValue(rollerHours);
                const m = getRollerValue(rollerMinutes);
                const s = getRollerValue(rollerSeconds);
                
                const totalSeconds = (h * 3600) + (m * 60) + s;
                if (totalSeconds > 0) {
                    let lbl = '';
                    if (h>0) lbl += \`\${h}h \`;
                    if (m>0) lbl += \`\${m}m \`;
                    if (s>0) lbl += \`\${s}s\`;
                    setSleepTimer(totalSeconds, lbl.trim());
                } else {
                    setSleepTimer(0, "Off");
                }
            });
        }
        
        const customContextMenu = component.querySelector('.custom-context-menu');
        
        document.addEventListener("click", () => { 
            settingsGroup?.classList.remove("is-open"); 
            if (customContextMenu) customContextMenu.style.display = "none";
            if (typeof wakeControls === 'function') wakeControls();
        });
        
        playerContainer?.addEventListener("contextmenu", e => {
            const hasLongPressTooltip = Array.from(e.composedPath()).some(el => el.hasAttribute && el.hasAttribute('data-tooltip'));
            if (!hasLongPressTooltip) {
                e.preventDefault();
                if (customContextMenu) {
                    customContextMenu.style.display = 'block';
                    const rect = playerContainer.getBoundingClientRect();
                    const menuRect = customContextMenu.getBoundingClientRect();
                    
                    let left = e.clientX - rect.left;
                    let top = e.clientY - rect.top;
                    
                    if (left + menuRect.width > rect.width) left = rect.width - menuRect.width - 10;
                    if (top + menuRect.height > rect.height) top = rect.height - menuRect.height - 10;
                    
                    customContextMenu.style.left = Math.max(10, left) + 'px';
                    customContextMenu.style.top = Math.max(10, top) + 'px';
                    e.stopPropagation();
                }
            }
        });
        
        ['click', 'mousedown', 'touchstart', 'touchmove', 'touchend', 'contextmenu'].forEach(evt => { 
            settingsMenuContainer?.addEventListener(evt, e => e.stopPropagation()); 
            customContextMenu?.addEventListener(evt, e => e.stopPropagation());
        });
        
        component.setAttribute("tabindex", -1);
        
        component.addEventListener("keydown", (e) => {
            if (!c.shortcuts || adManager.isAdPlaying || !video || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key.toLowerCase();
            const keyNumber = parseInt(e.key, 10);
            if (!isNaN(keyNumber) && keyNumber >= 0 && keyNumber <= 9) { e.preventDefault(); video.currentTime = video.duration * (keyNumber / 10); triggerPulse(\`\${keyNumber}0%\`); }
            if (e.key === '?') { e.preventDefault(); toggleShortcutsModal(); return; }
            if (e.key === 'Escape' && shortcutsModalOverlay?.classList.contains('is-visible')) { e.preventDefault(); toggleShortcutsModal(false); return; }
            switch (key) {
                case "k": case " ": e.preventDefault(); triggerPulse(video.paused ? playIconHTML : pauseIconHTML); playPauseBtn?.click(); break;
                case "m": e.preventDefault(); muteBtn?.click(); break;
                case "f": e.preventDefault(); fullscreenBtn?.click(); break;
                case "c": e.preventDefault(); topCcBtn?.click(); break;
                case "s": e.preventDefault(); if(networkSpeedIndicator) networkSpeedIndicator.style.display = networkSpeedIndicator.style.display === 'none' ? 'flex' : 'none'; break;
                case ",": e.preventDefault(); settingsBtn?.click(); break;
                case "p": e.preventDefault(); if(pipBtn && pipBtn.style.display !== 'none' && !pipBtn.disabled) pipBtn.click(); break;
                case "j": e.preventDefault(); video.currentTime -= 10; triggerGesture("left"); break;
                case "l": e.preventDefault(); video.currentTime += 10; triggerGesture("right"); break;
                case "arrowleft": e.preventDefault(); video.currentTime -= 5; triggerGesture("left"); break;
                case "arrowright": e.preventDefault(); video.currentTime += 5; triggerGesture("right"); break;
                case "arrowup": e.preventDefault(); let newVolumeUp = Math.min(1, video.volume + 0.05); video.volume = newVolumeUp; if(volumeIndicator) volumeIndicator.classList.add("active"); clearTimeout(volumeTimeout); volumeTimeout = setTimeout(() => { if(volumeIndicator) volumeIndicator.classList.remove("active");}, 1000); break;
                case "arrowdown": e.preventDefault(); let newVolumeDown = Math.max(0, video.volume - 0.05); video.volume = newVolumeDown; if(volumeIndicator) volumeIndicator.classList.add("active"); clearTimeout(volumeTimeout); volumeTimeout = setTimeout(() => { if(volumeIndicator) volumeIndicator.classList.remove("active");}, 1000); break;
            }
        });
        
        video?.addEventListener("playing", () => { if(loaderOverlay) loaderOverlay.classList.remove("active"); if(pipBtn) pipBtn.disabled = false; clearInterval(statsInterval); statsInterval = setInterval(updateStats, 1000); wakeControls(); });
        video?.addEventListener("pause", () => { 
            wakeControls(); 
            if(loaderOverlay) loaderOverlay.classList.remove("active");
        });
        video?.addEventListener("waiting", () => { if (!video.paused && loaderOverlay) loaderOverlay.classList.add("active"); });
        video?.addEventListener("loadedmetadata", () => { log("Event: loadedmetadata"); if (isFinite(video.duration)) { if(seekBar) seekBar.max = video.duration; if(durationDisplay) durationDisplay.textContent = formatTime(video.duration); } });
        video?.addEventListener("progress", () => {
            if (!isFinite(video.duration)) return; 
            const buffer = video.buffered; 
            if (buffer.length > 0) { 
                const bufferEnd = buffer.end(buffer.length - 1); 
                const bufferPercentage = (bufferEnd / video.duration) * 100; 
                if(seekBarBuffer) seekBarBuffer.style.width = \`\${bufferPercentage}%\`; 
            } 
        });
        video?.addEventListener("seeked", () => {
            analyticsQueue.seek++;
        });
        video?.addEventListener("timeupdate", () => { if (!isFinite(video.duration)) return; adManager.checkForMidroll(video.currentTime); if(seekBar) seekBar.value = video.currentTime; if(timeDisplay) timeDisplay.textContent = formatTime(video.currentTime); if(seekBarProgress) seekBarProgress.style.width = \`\${(video.currentTime / video.duration) * 100}%\`; updateAnnotations(); });
        video?.addEventListener("play", () => { 
            playPauseBtn?.classList.add("is-playing"); 
            playerContainer?.classList.remove("is-paused"); 
            
            // if audioCtx isn't set up yet, we should implicitly try to set it up
            if (!audioCtx && waveformToggle?.checked) {
                setupAudioProcessing().then(() => {
                    if (!waveformAnimationFrameId) {
                        waveformAnimationFrameId = requestAnimationFrame(drawAudioWaveform);
                    }
                });
            } else if (waveformToggle?.checked && !waveformAnimationFrameId) {
                waveformAnimationFrameId = requestAnimationFrame(drawAudioWaveform);
            }

            if (ambientToggle?.checked && !ambientAnimationFrameId) { 
                ambientAnimationFrameId = requestAnimationFrame(drawAmbientFrame); 
            }
            if (colorEnhanceToggle?.checked && !colorEnhanceAnimationFrameId) {
                colorEnhanceAnimationFrameId = requestAnimationFrame(drawColorEnhanceFrame);
            }
        });
        video?.addEventListener("pause", () => { playPauseBtn?.classList.remove("is-playing"); playerContainer?.classList.add("is-paused"); clearInterval(statsInterval); });
        video?.addEventListener("volumechange", () => { 
            const isMuted = video.muted || video.volume === 0;
            muteBtn?.classList.toggle("is-muted", isMuted); 
            mobileMuteBtn?.classList.toggle("is-muted", isMuted);
            if(mobileMuteToggle) mobileMuteToggle.checked = isMuted;
            if(volumeLevel) volumeLevel.style.height = \`\${video.volume * 100}%\`; 
            try { localStorage.setItem("mpc-player-volume", video.volume); localStorage.setItem("mpc-player-muted", video.muted); if(adVideo){ adVideo.volume = video.volume; adVideo.muted = video.muted; } } catch (e) {} 
        });
        
        const handleSeekPreview = (e) => {
            if (!video || !isFinite(video.duration) || !seekBar) return;
            const rect = seekBar.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX === undefined) return;
            
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            const hoverTime = percentage * video.duration;
            
            if (seekPreviewTime) seekPreviewTime.textContent = formatTime(hoverTime);
            if (seekPreview) seekPreview.style.left = \`\${percentage * 100}%\`;
        };
        
        const seekBarContainer = seekBar?.parentElement;
        seekBarContainer?.addEventListener("mousemove", handleSeekPreview);
        seekBarContainer?.addEventListener("touchmove", handleSeekPreview, { passive: true });
        seekBarContainer?.addEventListener("mouseenter", () => { if(seekPreview) seekPreview.style.display = 'block'; });
        seekBarContainer?.addEventListener("mouseleave", () => { if(seekPreview) seekPreview.style.display = 'none'; });

        playPauseBtn?.addEventListener("click", (e) => { 
            e.stopPropagation(); 
            if(!video) return; 
            triggerPulse(video.paused ? playIconHTML : pauseIconHTML); 
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) playPromise.catch(e => log("Play interrupted", e));
            } else {
                video.pause();
            }
        });
        [muteBtn, mobileMuteBtn].forEach(btn => btn?.addEventListener("click", (e) => { 
            e.stopPropagation(); 
            if (e.target.tagName === 'LABEL') return;
            if(video) {
                video.muted = !video.muted; 
                if (!video.muted && video.volume === 0) video.volume = 1;
            }
        }));
        seekBar?.addEventListener("input", () => { if (!video || !isFinite(video.duration)) return; video.currentTime = seekBar.value; if(seekBarProgress) seekBarProgress.style.width = \`\${(video.currentTime / video.duration) * 100}%\`; });
        fullscreenBtn?.addEventListener("click", (e) => { e.stopPropagation(); if (document.fullscreenElement) document.exitFullscreen(); else component.requestFullscreen().catch(err => log("Fullscreen failed:", err)); });
        
        document.addEventListener("fullscreenchange", () => {
            const isFullscreen = !!document.fullscreenElement;
            fullscreenBtn?.classList.toggle("is-fullscreen", isFullscreen);
            component?.classList.toggle("is-fullscreen", isFullscreen);
            if (isFullscreen) { if(fullscreenTitle) fullscreenTitle.textContent = ${title}; } else { wakeControls(); }
        });
    };
    
    window.addEventListener("online", () => { playerContainer?.classList.remove("is-offline"); if(networkStatusPopup) networkStatusPopup.style.display = "none"; });
    window.addEventListener("offline", () => { playerContainer?.classList.add("is-offline"); if(networkStatusPopup) networkStatusPopup.style.display = "flex"; if(video) video.pause(); });
    
    const formatQualityLabel = (level, isDuplicateResolution = false) => {
        let label = \`\${level.height}p\`;
        if (level.height >= 2160) { label += ' <span class="quality-badge">4K</span>'; } else if (level.height >= 1080) { label += ' <span class="quality-badge">HD</span>'; }
        if (isDuplicateResolution) { label += \` (\${(level.bitrate / 1000000).toFixed(1)} Mbps)\`; }
        return label;
    };
    
    const initStream = (autoplay = false) => {
        if (video) video.playbackRate = 1;
        if (currentSpeedLabel) currentSpeedLabel.textContent = "Normal";
        if (typeof updateSpeedUI === 'function') updateSpeedUI(1);
        speedOptions?.forEach(opt => {
            const speed = parseFloat(opt.dataset.speed);
            opt.classList.toggle("active", speed === 1);
        });
        const currentVideoSrc = ${videoSrc};
        if (currentVideoSrc.includes(".m3u8") && typeof Hls !== 'undefined' && Hls.isSupported()) {
            log("HLS.js setup for main content");
            hls = new Hls({ 
                debug: IS_DEBUG_MODE,
                maxBufferLength: 120,
                maxMaxBufferLength: 1200,
                maxBufferSize: 200 * 1000 * 1000,
                enableWorker: true,
                lowLatencyMode: false,
                abrFastSwitch: true,
                capLevelToPlayerSize: true,
                manifestLoadingTimeOut: 10000,
                manifestLoadingMaxRetry: 5,
                levelLoadingTimeOut: 10000,
                levelLoadingMaxRetry: 5,
                fragLoadingTimeOut: 40000,
                fragLoadingMaxRetry: 6,
                startLevel: -1 // start with auto
            });
            hls.loadSource(currentVideoSrc);
            if(video) hls.attachMedia(video);
            
            hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
                const stats = data.frag.stats;
                const durationSeconds = (stats.loading.end - stats.loading.start) / 1000;
                const bytesLoaded = stats.total;
                if (durationSeconds > 0 && bytesLoaded > 0) { baseNetworkSpeed = (bytesLoaded / 1024) / durationSeconds; }
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                log("HLS Manifest Parsed");
                if (autoplay && !adManager.isAdPlaying && video) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) playPromise.catch(e => {
                        log('HLS autoplay error', e);
                        if(loaderOverlay) loaderOverlay.classList.remove("active");
                    });
                }
                const { levels, subtitleTracks } = hls;
                if (levels.length > 0 && qualityNav && qualityMenuList) {
                    qualityNav.style.display = "flex";
                    qualityNav.parentElement.classList.remove("disabled");
                    qualityMenuList.innerHTML = "";
                    const levelsByHeight = levels.reduce((acc, level) => { if (!acc[level.height]) acc[level.height] = []; acc[level.height].push(level); return acc; }, {});
                    if (levels.length > 1) {
                        const autoOption = document.createElement("li");
                        autoOption.className = "menu-item quality-option active";
                        autoOption.textContent = "Auto";
                        autoOption.dataset.level = -1;
                        autoOption.addEventListener("click", e => { e.stopPropagation(); if (hls.currentLevel === -1 && hls.nextLevel === -1) return; showToast(\`Switching to Auto quality...\`); qualityMenuList.querySelectorAll('.quality-option').forEach(opt => opt.classList.remove('active')); autoOption.classList.add('active'); if(currentQualityLabel) currentQualityLabel.innerHTML = 'Auto'; hls.currentLevel = -1; showSubMenu(); });
                        qualityMenuList.prepend(autoOption);
                        levels.forEach((level, index) => {
                            const isDuplicate = levelsByHeight[level.height].length > 1;
                            const option = document.createElement("li");
                            option.className = "menu-item quality-option";
                            option.innerHTML = formatQualityLabel(level, isDuplicate);
                            option.dataset.level = index;
                            option.addEventListener("click", e => { e.stopPropagation(); const newLevel = parseInt(option.dataset.level, 10); if (hls.currentLevel !== newLevel && hls.nextLevel !== newLevel) { showToast(\`Switching quality...\`); qualityMenuList.querySelectorAll('.quality-option').forEach(opt => opt.classList.remove('active')); option.classList.add('active'); if(currentQualityLabel) currentQualityLabel.innerHTML = formatQualityLabel(level, isDuplicate); if (video && video.paused) { hls.nextLevel = newLevel; } else { hls.currentLevel = newLevel; } showSubMenu(); } });
                            qualityMenuList.appendChild(option);
                        });
                    } else {
                        const option = document.createElement("li");
                        option.className = "menu-item quality-option active";
                        option.innerHTML = formatQualityLabel(levels[0]);
                        option.dataset.level = 0;
                        qualityMenuList.appendChild(option);
                        if(currentQualityLabel) currentQualityLabel.innerHTML = formatQualityLabel(levels[0]);
                    }
                    if (hls.autoLevelEnabled && hls.levels[hls.startLevel]) { 
                        if(currentQualityLabel) currentQualityLabel.innerHTML = \`Auto (\${hls.levels[hls.startLevel].height}p)\`; 
                        updateSettingsIconColor(hls.levels[hls.startLevel].height);
                    } else if (hls.levels[hls.currentLevel]) { 
                        if(currentQualityLabel) currentQualityLabel.innerHTML = formatQualityLabel(hls.levels[hls.currentLevel]); 
                        updateSettingsIconColor(hls.levels[hls.currentLevel].height);
                    }
                }
                if (subtitleTracks.length > 0 && subtitlesNav && subtitlesMenuList) {
                    subtitlesNav.parentElement.classList.remove("disabled");
                    subtitlesMenuList.innerHTML = "";
                    const offOption = document.createElement("li");
                    offOption.className = "menu-item subtitle-option active";
                    offOption.textContent = "Off";
                    offOption.dataset.track = -1;
                    offOption.addEventListener("click", (e) => { e.stopPropagation(); hls.subtitleTrack = -1; if(currentSubtitleLabel) currentSubtitleLabel.textContent = "Off"; Array.from(subtitlesMenuList.children).forEach(el => el.classList.remove("active")); offOption.classList.add("active"); showSubMenu(); });
                    subtitlesMenuList.appendChild(offOption);
                    subtitleTracks.forEach((track, index) => {
                        const option = document.createElement("li");
                        option.className = "menu-item subtitle-option";
                        option.textContent = track.name;
                        option.dataset.track = index;
                        option.addEventListener("click", (e) => { e.stopPropagation(); hls.subtitleTrack = parseInt(option.dataset.track, 10); if(currentSubtitleLabel) currentSubtitleLabel.textContent = track.name; Array.from(subtitlesMenuList.children).forEach(el => el.classList.remove("active")); option.classList.add("active"); showSubMenu(); });
                        subtitlesMenuList.appendChild(option);
                    });
                }
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            log("Fatal network error encountered, trying to recover");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            log("Fatal media error encountered, trying to recover");
                            hls.recoverMediaError();
                            break;
                        default:
                            log("Fatal HLS error:", data.details);
                            showError("Video stream could not be loaded. Please check your connection.");
                            hls.destroy();
                            break;
                    }
                }
            });
            hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => { 
                log("HLS Level Switched", data); 
                const level = hls.levels[data.level]; 
                if (level) { 
                    if (hls.autoLevelEnabled && currentQualityLabel) { currentQualityLabel.innerHTML = \`Auto (\${level.height}p)\`; } 
                    showToast(\`Switched to \${level.height}p\`);
                    updateSettingsIconColor(level.height);
                } 
                analyticsQueue.quality++;
                if(qualityMenuList) Array.from(qualityMenuList.children).forEach(opt => { const levelIndex = parseInt(opt.dataset.level); opt.classList.toggle("active", levelIndex === data.level); }); 
            });
            hls.on(Hls.Events.ERROR, (event, data) => { log('HLS.js Error:', data); if (data.fatal) { switch (data.type) { case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break; case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break; default: hls.destroy(); break; } } else { switch (data.details) { case Hls.ErrorDetails.FRAG_LOAD_ERROR: case Hls.ErrorDetails.LEVEL_LOAD_ERROR: case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT: case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT: showToast("Network issue, attempting to recover playback..."); break; } } });
        } else if (currentVideoSrc.includes(".mpd") && typeof dashjs !== 'undefined') {
            log("Dash.js setup for main content");
            dashApp = dashjs.MediaPlayer().create();
            dashApp.initialize(video, currentVideoSrc, (autoplay && !adManager.isAdPlaying));
            
            dashApp.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
                log("DASH Stream Initialized");
                const bitrates = dashApp.getBitrateInfoListFor("video");
                if (bitrates.length > 0 && qualityNav && qualityMenuList) {
                    qualityNav.style.display = "flex";
                    qualityNav.parentElement.classList.remove("disabled");
                    qualityMenuList.innerHTML = "";
                    
                    if (bitrates.length > 1) {
                        const autoOption = document.createElement("li");
                        autoOption.className = "menu-item quality-option active";
                        autoOption.textContent = "Auto";
                        autoOption.dataset.level = -1;
                        autoOption.addEventListener("click", e => { 
                            e.stopPropagation(); 
                            showToast(\`Switching to Auto quality...\`); 
                            qualityMenuList.querySelectorAll('.quality-option').forEach(opt => opt.classList.remove('active')); 
                            autoOption.classList.add('active'); 
                            if(currentQualityLabel) currentQualityLabel.innerHTML = 'Auto'; 
                            dashApp.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
                            updateSettingsIconColor('auto');
                            showSubMenu(); 
                        });
                        qualityMenuList.prepend(autoOption);
                        
                        bitrates.forEach((bitrate, index) => {
                            const option = document.createElement("li");
                            option.className = "menu-item quality-option";
                            option.innerHTML = formatQualityLabel({ height: bitrate.height, bitrate: bitrate.bitrate });
                            option.dataset.level = index;
                            option.addEventListener("click", e => { 
                                e.stopPropagation(); 
                                showToast(\`Switching quality...\`); 
                                qualityMenuList.querySelectorAll('.quality-option').forEach(opt => opt.classList.remove('active')); 
                                option.classList.add('active'); 
                                if(currentQualityLabel) currentQualityLabel.innerHTML = formatQualityLabel({ height: bitrate.height, bitrate: bitrate.bitrate }); 
                                dashApp.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
                                dashApp.setQualityFor("video", index);
                                updateSettingsIconColor(bitrate.height);
                                showSubMenu(); 
                            });
                            qualityMenuList.appendChild(option);
                        });
                    } else {
                        const option = document.createElement("li");
                        option.className = "menu-item quality-option active";
                        option.innerHTML = formatQualityLabel({ height: bitrates[0].height, bitrate: bitrates[0].bitrate });
                        option.dataset.level = 0;
                        qualityMenuList.appendChild(option);
                        if(currentQualityLabel) currentQualityLabel.innerHTML = formatQualityLabel({ height: bitrates[0].height, bitrate: bitrates[0].bitrate });
                        updateSettingsIconColor(bitrates[0].height);
                    }
                }
            });
            
            dashApp.on(dashjs.MediaPlayer.events.ERROR, (e) => {
                log('Dash.js Error:', e);
                showError("Video stream could not be loaded. Please check your connection.");
            });
            dashApp.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (e) => {
                if (e.mediaType === "video") {
                    const reqBitrate = dashApp.getBitrateInfoListFor("video")[e.newQuality];
                    if (reqBitrate) updateSettingsIconColor(reqBitrate.height);
                }
            });
        } else if (video && video.canPlayType('application/vnd.apple.mpegurl') && currentVideoSrc.includes(".m3u8")) {
            // Safari native HLS support
            log("Native HLS support detected");
            video.src = currentVideoSrc;
            if (autoplay && !adManager.isAdPlaying) {
                const playPromise = video.play();
                if (playPromise !== undefined) playPromise.catch(e => {
                    log('native HLS play error', e);
                    if(loaderOverlay) loaderOverlay.classList.remove("active");
                });
            }
            video.addEventListener('loadedmetadata', () => {
                initNativeSubtitles();
            });
        } else if (video) {
            log("Native playback (MP4/WebM/etc) or Fallback");
            video.src = currentVideoSrc;
            if (autoplay && !adManager.isAdPlaying) {
                const playPromise = video.play();
                if (playPromise !== undefined) playPromise.catch(e => {
                    log('native fallback play error', e);
                    if(loaderOverlay) loaderOverlay.classList.remove("active");
                });
            }
            video.addEventListener('loadedmetadata', () => {
                initNativeSubtitles();
            });
        } else { log("Video element not found or HLS.js not supported."); }
    };
    
    const initNativeSubtitles = () => {
        if (video && video.textTracks.length > 0 && subtitlesNav && subtitlesMenuList) {
            subtitlesNav.parentElement.classList.remove("disabled");
            subtitlesMenuList.innerHTML = "";
            const offOption = document.createElement("li");
            offOption.className = "menu-item subtitle-option active";
            offOption.textContent = "Off";
            offOption.dataset.track = -1;
            offOption.addEventListener("click", (e) => { e.stopPropagation(); Array.from(video.textTracks).forEach(track => track.mode = "hidden"); if(currentSubtitleLabel) currentSubtitleLabel.textContent = "Off"; Array.from(subtitlesMenuList.children).forEach(el => el.classList.remove("active")); offOption.classList.add("active"); showSubMenu(); });
            subtitlesMenuList.appendChild(offOption);
            Array.from(video.textTracks).forEach((track, index) => {
                track.mode = "hidden";
                const option = document.createElement("li");
                option.className = "menu-item subtitle-option";
                option.textContent = track.label;
                option.dataset.track = index;
                option.addEventListener("click", (e) => { e.stopPropagation(); Array.from(video.textTracks).forEach((t, i) => t.mode = (i === index) ? "showing" : "hidden"); if(currentSubtitleLabel) currentSubtitleLabel.textContent = track.label; Array.from(subtitlesMenuList.children).forEach(el => el.classList.remove("active")); option.classList.add("active"); showSubMenu(); });
                subtitlesMenuList.appendChild(option);
            });
        }
    };
    
    playOverlay?.addEventListener("click", () => {
        playbackHasStarted = true;
        wakeControls();
        if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        if(playOverlay) playOverlay.style.display = "none";
        if(video) video.style.display = "block";
        
        const thumbnail = component.querySelector(".player-thumbnail");
        if (thumbnail) {
            thumbnail.classList.add("hide-completely");
            setTimeout(() => { thumbnail.remove(); }, 300);
        }
        
        const currentVideoSrc = ${videoSrc};
        
        if(video) {
            video.addEventListener('loadedmetadata', () => {
                initNativeSubtitles();
                if (video.videoWidth && video.videoHeight) {
                    if ("${aspectRatio}" === "auto") {
                        playerContainer.style.aspectRatio = \`\${video.videoWidth} / \${video.videoHeight}\`;
                    }
                }
            }, { once: true });
        }
        
        const prerollAd = adSchedule.find(ad => ad.type === 'preroll' && !ad.played);
        if (prerollAd) { 
            triggerPulse(playIconHTML);
            if (video) { video.play().catch(() => {}); video.pause(); } // Sync unlock for main video
            initStream(false);
            adManager.playAd(prerollAd); 
        } else { 
            triggerPulse(playIconHTML); 
            if(loaderOverlay) loaderOverlay.classList.add("active");
            if (video) {
                const playPromise = video.play();
                if (playPromise !== undefined) playPromise.catch(e => log('Sync play error (expected)', e));
            }
            initStream(true);
        }
        
        initializeControls();
        startAnalyticsBeacon();
    }, { once: true });

})();
  `;
};

module.exports = { getScript };
