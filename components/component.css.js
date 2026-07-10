// File: api/component.css.js

const cssString = `
:root {
  --brand: #8b5cf6;
  --seek-progress-color: #8b5cf6;
  --toggle-on-bg: #8b5cf6;
  --text-light: #f9fafb;
  --text-dark: #d1d5db;
  --bg-dark: #000000;
  --bg-light: #111827;
  
  /* UPDATED: Liquid Glass Theme Variables - Trully transparent and blurry */
  --glass-bg: rgba(22, 22, 26, 0.25);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(16px);
  --glass-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.2);
  --glass-hover: rgba(255, 255, 255, 0.15);
}

.media-player-wrapper {
  width: 100%;
  overflow: visible;
  position: relative;
  contain: none;
}

.media-player-wrapper .media-player-component {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-light);
  border-radius: 16px;
  overflow: visible;
  position: relative;
  width: 100%;
  max-width: 1600px;
  margin: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-light);
  outline: none !important;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-player-wrapper .media-player-component button,
.media-player-wrapper .media-player-component input,
.media-player-wrapper .media-player-component select {
  -webkit-appearance: none;
  appearance: none;
}

.media-player-wrapper .media-player-component *:focus {
  outline: none !important;
}

/* Custom Scrollbar for Settings Menu */
.media-player-wrapper .settings-menu-container ::-webkit-scrollbar {
  width: 6px;
}
.media-player-wrapper .settings-menu-container ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.media-player-wrapper .settings-menu-container ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.media-player-wrapper .settings-menu-container ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Custom selection color */
.media-player-wrapper .media-player-component ::selection {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* Ensure buttons don't have default styles */
.media-player-wrapper .media-player-component button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

/* Hide default video controls just in case */
.media-player-wrapper .media-player-component video::-webkit-media-controls {
  display: none !important;
}
.media-player-wrapper .media-player-component video::-webkit-media-controls-enclosure {
  display: none !important;
}

/* Global Liquid Glass Panel Utility */
.media-player-wrapper .glass-panel {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  color: var(--text-light);
}

.media-player-wrapper .media-player-component *,
.media-player-wrapper .media-player-component *::before,
.media-player-wrapper .media-player-component *::after {
  box-sizing: inherit;
}

.media-player-wrapper .player-container {
  position: relative;
  z-index: 1;
  aspect-ratio: 16 / 9; container-type: size;
  width: 100%;
  overflow: hidden;
  background: var(--bg-dark);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  -webkit-user-select: none;
  user-select: none;
  transition: background-color 0.3s, aspect-ratio 0.3s ease-out;
}

.media-player-wrapper .media-player-component:fullscreen .player-container {
  aspect-ratio: auto;
  height: 100vh;
}

.media-player-wrapper .player-container.is-offline {
  background: rgba(127, 29, 29, 0.2);
}

.media-player-wrapper .player-container video {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%; border: 0;
}

.media-player-wrapper .player-container video.is-hdr {
  filter: brightness(1.05) contrast(1.1) saturate(1.15);
}

.media-player-wrapper .player-container video.is-color-enhance {
  filter: saturate(1.4) contrast(1.05);
}

.media-player-wrapper .player-container video.is-hdr.is-color-enhance {
  filter: brightness(1.05) contrast(1.15) saturate(1.5);
}

.media-player-wrapper .content-video {
  z-index: 1;
}

/* --- THUMBNAIL (HARD HIDE LOGIC) --- */
.media-player-wrapper .player-thumbnail {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover;
  z-index: 2;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  opacity: 1;
  visibility: visible;
}

.media-player-wrapper .player-thumbnail.hide-completely {
  opacity: 0 !important;
  visibility: hidden !important;
}

/* --- BRAND WATERMARK LOGIC --- */
.media-player-wrapper .player-watermark {
  position: absolute; 
  z-index: 15; 
  transition: opacity 0.4s ease, visibility 0.4s ease; 
  pointer-events: none; 
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-player-wrapper .player-container.controls-active .player-watermark,
.media-player-wrapper .player-container.is-paused .player-watermark {
  pointer-events: all;
  opacity: 1 !important;
  visibility: visible !important;
}

.media-player-wrapper .player-container.is-playing:not(.controls-active):not(:hover) .player-watermark {
  opacity: 0 !important;
  visibility: hidden !important;
}

.media-player-wrapper .player-watermark a { display: block; width: 100%; height: auto; border-radius: inherit; }
.media-player-wrapper .player-watermark img { width: 100%; height: auto; display: block; border-radius: inherit; }
.media-player-wrapper .player-watermark.position-top-right { top: 20px; right: 20px; }
.media-player-wrapper .player-watermark.position-top-left { top: 20px; left: 20px; }
.media-player-wrapper .player-watermark.position-bottom-right { bottom: 85px; right: 20px; }
.media-player-wrapper .player-watermark.position-bottom-left { bottom: 85px; left: 20px; }

/* --- TOP CONTROLS (SLEEP TIMER, CC, NETWORK SPEED) --- */
.media-player-wrapper .top-controls {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 20;
  opacity: 0; visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.media-player-wrapper .player-container.controls-active .top-controls,
.media-player-wrapper .player-container.is-paused .top-controls {
  opacity: 1; visibility: visible;
}

.media-player-wrapper .top-left-controls,
.media-player-wrapper .top-right-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto; 
}

.media-player-wrapper .sleep-timer-display,
.media-player-wrapper .top-cc-btn,
.media-player-wrapper .network-speed-indicator {
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.media-player-wrapper .sleep-timer-display svg,
.media-player-wrapper .top-cc-btn svg,
.media-player-wrapper .network-speed-indicator svg {
  width: 16px; height: 16px; opacity: 0.8;
}

.media-player-wrapper .sleep-timer-display:hover,
.media-player-wrapper .network-speed-indicator:hover,
.media-player-wrapper .top-cc-btn {
  cursor: pointer;
}

.media-player-wrapper .top-cc-btn:hover {
  background: var(--glass-hover);
  transform: scale(1.02);
}

.media-player-wrapper .speed-text {
  min-width: 60px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.media-player-wrapper .pill-panel {
  border-radius: 8px;
  padding: 6px 14px;
}
.media-player-wrapper .pill-panel svg {
  width: 18px;
  height: 18px;
}

.media-player-wrapper .quality-badge {
  padding: 0 8px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  border-radius: 6px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.media-player-wrapper .quality-badge.hdr-tag {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  box-shadow: 0 4px 10px rgba(251, 191, 36, 0.1);
}

.media-player-wrapper .quality-badge.color-enhance-tag {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 4px 10px rgba(56, 189, 248, 0.1);
}

/* --- PLAY OVERLAY & PULSE --- */
.media-player-wrapper .play-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  cursor: pointer; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s; opacity: 0;
}

.media-player-wrapper .media-player-component:hover .play-overlay {
  opacity: 1;
}

.media-player-wrapper .play-overlay svg {
  border-radius: 16px;
  padding: 20px;
  width: 90px; height: 90px;
  fill: #fff;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transform: scale(1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.media-player-wrapper .play-overlay svg:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.media-player-wrapper .playback-pulse {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 80px; height: 80px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  z-index: 3; pointer-events: none; opacity: 0;
}
.media-player-wrapper .playback-pulse.animate { animation: mpc-pulse 0.5s ease-out; }
.media-player-wrapper .playback-pulse svg { width: 48px; height: 48px; }

@keyframes mpc-pulse {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
}

/* --- BOTTOM CONTROLS WRAPPER --- */
.media-player-wrapper .bottom-controls-wrapper {
  position: absolute;
  bottom: 0px; left: 0px; right: 0px;
  padding: 10px 0 12px 0;
  display: flex; flex-direction: column; gap: 8px;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  opacity: 0; visibility: hidden; 
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              visibility 0.3s, 
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(10px);
  z-index: 30;
}

.media-player-wrapper .player-container.controls-active .bottom-controls-wrapper,
.media-player-wrapper .player-container.is-paused .bottom-controls-wrapper {
  opacity: 1; visibility: visible;
  transform: translateY(0);
}

.media-player-wrapper .custom-controls {
  display: flex; align-items: center; justify-content: flex-start; gap: 4px;
  width: 100%;
  padding: 0 16px;
}


.media-player-wrapper .custom-controls > button,
.media-player-wrapper .custom-controls .settings-group > button {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: none !important;
  box-shadow: none !important;
  width: 44px; height: 44px; padding: 0;
  color: white; cursor: pointer; opacity: 0.9;
  transition: opacity 0.2s; 
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.media-player-wrapper .custom-controls > button:hover,
.media-player-wrapper .custom-controls .settings-group > button:hover {
  background: transparent !important; 
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  opacity: 1;
  color: white;
  transform: none;
}

/* Better focus visibility for keyboard users */
.media-player-wrapper .media-player-component:focus-visible {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.4);
}

.media-player-wrapper .custom-controls > button:active,
.media-player-wrapper .custom-controls .settings-group > button:active {
  transform: scale(0.95);
}

.media-player-wrapper .custom-controls > button svg,
.media-player-wrapper .custom-controls .settings-group > button svg {
  width: 24px; height: 24px; display: block; pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6));
}

.media-player-wrapper .play-pause-btn,
.media-player-wrapper .mute-btn,
.media-player-wrapper #mobile-mute-btn .icon,
.media-player-wrapper .fullscreen-btn { position: relative; display: flex; align-items: center; justify-content: center; }
.media-player-wrapper .play-pause-btn svg,
.media-player-wrapper .mute-btn svg,
.media-player-wrapper #mobile-mute-btn .icon svg,
.media-player-wrapper .fullscreen-btn svg { position: absolute; transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: center; }

.media-player-wrapper .play-pause-btn svg:first-child,
.media-player-wrapper .mute-btn svg:first-child,
.media-player-wrapper #mobile-mute-btn .icon svg:first-child,
.media-player-wrapper .fullscreen-btn svg:first-child { opacity: 1; transform: scale(1) rotate(0deg); }

.media-player-wrapper .play-pause-btn:not(.is-playing) svg:last-child,
.media-player-wrapper .mute-btn:not(.is-muted) svg:last-child,
.media-player-wrapper #mobile-mute-btn:not(.is-muted) .icon svg:last-child,
.media-player-wrapper .fullscreen-btn:not(.is-fullscreen) svg:last-child { opacity: 0; transform: scale(0.5) rotate(90deg); pointer-events: none; }

.media-player-wrapper .play-pause-btn.is-playing svg:first-child,
.media-player-wrapper .mute-btn.is-muted svg:first-child,
.media-player-wrapper #mobile-mute-btn.is-muted .icon svg:first-child,
.media-player-wrapper .fullscreen-btn.is-fullscreen svg:first-child { opacity: 0; transform: scale(0.5) rotate(-90deg); pointer-events: none; }

.media-player-wrapper .play-pause-btn.is-playing svg:last-child,
.media-player-wrapper .mute-btn.is-muted svg:last-child,
.media-player-wrapper #mobile-mute-btn.is-muted .icon svg:last-child,
.media-player-wrapper .fullscreen-btn.is-fullscreen svg:last-child { opacity: 1; transform: scale(1) rotate(0deg); }

.media-player-wrapper .time-and-seek {
  display: flex; align-items: center; gap: 6px; padding: 0; min-width: 0;
  background: transparent !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
  border: none !important; box-shadow: none !important;
  color: rgba(255, 255, 255, 0.9);
}

.media-player-wrapper .spacer {
  flex-grow: 1;
}

.media-player-wrapper .duration-divider {
  opacity: 0.5;
}

.media-player-wrapper .time-display,
.media-player-wrapper .duration-display {
  font-size: 0.85rem; font-weight: 500; min-width: 36px; text-align: center; flex-shrink: 0;
}

.media-player-wrapper .seek-bar-container {
  position: relative; width: calc(100% - 32px); margin: 0 16px; display: flex; align-items: center; height: 20px; cursor: pointer;
}

.media-player-wrapper .seek-bar-track,
.media-player-wrapper .seek-bar-buffer,
.media-player-wrapper .seek-bar-progress {
  position: absolute; left: 0; right: 0; height: 6px; border-radius: 3px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-player-wrapper .seek-bar-track { 
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(12px); 
  -webkit-backdrop-filter: blur(12px); 
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.1); 
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.media-player-wrapper .seek-bar-buffer { background: rgba(255, 255, 255, 0.2); width: 0; }
.media-player-wrapper .seek-bar-progress { 
  background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, var(--brand) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  width: 0; 
  z-index: 1; 
  border-radius: 4px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.2), 0 0 12px var(--brand); 
}

.media-player-wrapper .seek-bar-container:hover .seek-bar-track,
.media-player-wrapper .seek-bar-container:hover .seek-bar-buffer,
.media-player-wrapper .seek-bar-container:hover .seek-bar-progress,
.media-player-wrapper .seek-bar-container:focus-within .seek-bar-track,
.media-player-wrapper .seek-bar-container:focus-within .seek-bar-buffer,
.media-player-wrapper .seek-bar-container:focus-within .seek-bar-progress { height: 10px; border-radius: 5px; }

.media-player-wrapper .seek-bar {
  -webkit-appearance: none; appearance: none; width: 100%; height: 100%; background: transparent; position: absolute; left: 0; top: 0; z-index: 2; margin: 0; cursor: pointer;
  outline: none !important; border: none !important; box-shadow: none !important;
}

.media-player-wrapper .seek-bar:focus-visible,
.media-player-wrapper .seek-bar:focus {
  outline: none !important;
  box-shadow: none !important;
}

.media-player-wrapper .seek-bar::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%;
  border: 4px solid var(--brand); box-shadow: 0 0 10px rgba(0,0,0,0.5); transform: scale(0.5); opacity: 0; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s, background-color 0.2s, border-color 0.2s;
}
.media-player-wrapper .seek-bar::-moz-range-thumb {
  appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%;
  border: 4px solid var(--brand); box-shadow: 0 0 10px rgba(0,0,0,0.5); transform: scale(0.5); opacity: 0; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s, background-color 0.2s, border-color 0.2s;
}

.media-player-wrapper .seek-bar-container:hover .seek-bar::-webkit-slider-thumb,
.media-player-wrapper .seek-bar:active::-webkit-slider-thumb,
.media-player-wrapper .seek-bar:focus-visible::-webkit-slider-thumb { transform: scale(1.2); opacity: 1; background: var(--brand); border-color: #fff; }
.media-player-wrapper .seek-bar-container:hover .seek-bar::-moz-range-thumb,
.media-player-wrapper .seek-bar:active::-moz-range-thumb,
.media-player-wrapper .seek-bar:focus-visible::-moz-range-thumb { transform: scale(1.2); opacity: 1; background: var(--brand); border-color: #fff; }

/* --- MENUS, SETTINGS & MODALS --- */
.media-player-wrapper .settings-group { position: relative; }
.media-player-wrapper .settings-btn svg { transition: transform 0.3s ease-in-out; }
.media-player-wrapper .settings-group.is-open .settings-btn svg { transform: rotate(90deg); }

/* UPDATED Settings Menu Positioning */
.media-player-wrapper .settings-menu-container {
  position: absolute; 
  bottom: calc(100% + 16px); 
  width: min(280px, 85vw);
  max-height: calc(100cqh - 80px);
  display: flex;
  flex-direction: column;
  right: 0; 
  opacity: 0; 
  visibility: hidden; 
  transform: translateY(10px);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s;
  overflow: hidden; 
  border-radius: 16px; 
  z-index: 30;
}

.media-player-wrapper .settings-group.is-open .settings-menu-container { opacity: 1; visibility: visible; transform: translateY(0); }

.media-player-wrapper .settings-menu { transition: transform 0.25s ease-in-out; width: 100%; height: 100%; display: flex; flex-direction: column; }

.media-player-wrapper .settings-menu-container.show-speed .main-menu,
.media-player-wrapper .settings-menu-container.show-quality .main-menu,
.media-player-wrapper .settings-menu-container.show-share .main-menu,
.media-player-wrapper .settings-menu-container.show-subtitles .main-menu,
.media-player-wrapper .settings-menu-container.show-sleep .main-menu,
.media-player-wrapper .settings-menu-container.show-custom-sleep .main-menu,
.media-player-wrapper .settings-menu-container.show-configuration .main-menu { transform: translateX(-100%); }

.media-player-wrapper .settings-menu.speed-menu,
.media-player-wrapper .settings-menu.quality-menu,
.media-player-wrapper .settings-menu.share-menu,
.media-player-wrapper .settings-menu.subtitles-menu,
.media-player-wrapper .settings-menu.sleep-menu,
.media-player-wrapper .settings-menu.custom-sleep-menu,
.media-player-wrapper .settings-menu.configuration-menu { position: absolute; top: 0; left: 0; transform: translateX(100%); }

.media-player-wrapper .settings-menu-container.show-custom-sleep .sleep-menu { transform: translateX(-100%); }

.media-player-wrapper .settings-menu-container.show-speed .speed-menu,
.media-player-wrapper .settings-menu-container.show-quality .quality-menu,
.media-player-wrapper .settings-menu-container.show-share .share-menu,
.media-player-wrapper .settings-menu-container.show-subtitles .subtitles-menu,
.media-player-wrapper .settings-menu-container.show-sleep .sleep-menu,
.media-player-wrapper .settings-menu-container.show-custom-sleep .custom-sleep-menu,
.media-player-wrapper .settings-menu-container.show-configuration .configuration-menu { transform: translateX(0); }

.media-player-wrapper .settings-menu-container {
  /* removed perspective here */
}
.media-player-wrapper .settings-menu:not(.main-menu) ul { 
  list-style: none; margin: 0; padding: 6px; padding-top: 80px; padding-bottom: 80px; max-height: min(320px, calc(100cqh - 110px)); overflow-y: scroll; overscroll-behavior: contain; flex: 1; pointer-events: auto; scroll-snap-type: y mandatory; scroll-behavior: smooth;
  scrollbar-width: none;
  position: relative;
  perspective: 600px;
}
.media-player-wrapper .settings-menu:not(.main-menu) ul::-webkit-scrollbar { display: none; }
.media-player-wrapper .settings-menu:not(.main-menu) .menu-item {
  scroll-snap-align: center;
  transform: rotateX(var(--rot, 0deg)) scale(var(--s, 1)) translateY(var(--ty, 0px));
  opacity: var(--op, 1);
  transform-origin: center center;
  transition: transform 0.1s, opacity 0.1s;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  justify-content: center;
  text-align: center;
  font-size: 1.05rem;
  gap: 8px;
}
.media-player-wrapper .settings-menu:not(.main-menu) .menu-item .icon {
  margin-right: 0;
}
.media-player-wrapper .settings-menu:not(.main-menu) .menu-item .label {
  flex-grow: 0;
  text-align: center;
}
.media-player-wrapper .settings-menu.main-menu ul { list-style: none; margin: 0; padding: 6px; max-height: min(320px, calc(100cqh - 110px)); overflow-y: auto; overscroll-behavior: contain; flex: 1; }
.media-player-wrapper .settings-menu.main-menu ul::-webkit-scrollbar { width: 6px; }
.media-player-wrapper .settings-menu.main-menu ul::-webkit-scrollbar-track { background: transparent; }
.media-player-wrapper .settings-menu.main-menu ul::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; }
.media-player-wrapper .settings-menu.main-menu ul::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }

.media-player-wrapper .menu-item {
  display: flex; align-items: center; padding: 10px 12px; border-radius: 10px;
  font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.1s;
  color: #f1f1f1; margin-bottom: 2px;
}
.media-player-wrapper .menu-item:last-child { margin-bottom: 0; }
.media-player-wrapper .menu-item:not(.disabled):hover { background: rgba(255, 255, 255, 0.12); }
.media-player-wrapper .responsive-setting { display: none !important; }

.media-player-wrapper .menu-item .icon { margin-right: 14px; width: 28px; height: 28px; padding: 5px; display: flex; align-items: center; justify-content: center; opacity: 0.95; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 8px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05); transition: background 0.2s ease, transform 0.2s ease; }
.media-player-wrapper .menu-item:hover .icon { background: rgba(255, 255, 255, 0.12); transform: scale(1.05); opacity: 1; }
.media-player-wrapper .menu-item .icon svg { width: 100%; height: 100%; stroke-width: 2.2px; }
.media-player-wrapper .menu-item.share-option[data-platform="twitter"] .icon,
.media-player-wrapper .menu-item.share-option[data-platform="twitter"]:hover .icon { color: white; background: rgba(0, 0, 0, 0.4); border-color: rgba(255,255,255,0.1); }
.media-player-wrapper .menu-item.share-option[data-platform="facebook"] .icon,
.media-player-wrapper .menu-item.share-option[data-platform="facebook"]:hover .icon { color: #1877F2; background: rgba(24, 119, 242, 0.15); border-color: rgba(24, 119, 242, 0.3); }
.media-player-wrapper .menu-item.share-option[data-platform="whatsapp"] .icon,
.media-player-wrapper .menu-item.share-option[data-platform="whatsapp"]:hover .icon { color: #25D366; background: rgba(37, 211, 102, 0.15); border-color: rgba(37, 211, 102, 0.3); }
.media-player-wrapper .menu-item.share-option[data-platform="linkedin"] .icon,
.media-player-wrapper .menu-item.share-option[data-platform="linkedin"]:hover .icon { color: #0A66C2; background: rgba(10, 102, 194, 0.15); border-color: rgba(10, 102, 194, 0.3); }
.media-player-wrapper .menu-item.share-option[data-platform="email"] .icon,
.media-player-wrapper .menu-item.share-option[data-platform="email"]:hover .icon { color: #EA4335; background: rgba(234, 67, 53, 0.15); border-color: rgba(234, 67, 53, 0.3); }
.media-player-wrapper .menu-item.share-option[data-platform="copy"] .icon,
.media-player-wrapper .menu-item.share-option[data-platform="copy"]:hover .icon { color: #A855F7; background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.3); }

.media-player-wrapper .menu-item .label { flex-grow: 1; letter-spacing: 0.1px; }
.media-player-wrapper .menu-item .value { color: rgba(255, 255, 255, 0.6); padding-right: 8px; flex-shrink: 0; white-space: nowrap; max-width: 50%; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem; font-weight: 500; }
.media-player-wrapper .menu-nav-item .nav-chevron { 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 8px;
  opacity: 0.5;
}
.media-player-wrapper .menu-nav-item .nav-chevron svg { 
  width: 100%; 
  height: 100%; 
}
.media-player-wrapper .menu-item.disabled { opacity: 0.5; cursor: default; }
.media-player-wrapper .media-player-component .menu-item.configuration-option { padding-left: 44px; }

/* Custom Configuration UI Styles */
.media-player-wrapper #save-result-container code {
  color: var(--brand);
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.5);
}

.media-player-wrapper #load-config-key-input {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  outline: none !important;
}

.media-player-wrapper #load-config-key-input:focus {
  border-color: var(--brand);
  background: rgba(0, 0, 0, 0.6) !important;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.media-player-wrapper #confirm-load-config-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.media-player-wrapper #confirm-load-config-btn:active {
  transform: translateY(0);
}

.media-player-wrapper .submenu-header { display: flex; align-items: center; padding: 12px 14px 10px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 4px; }
.media-player-wrapper .submenu-back-btn { background: 0; border: 0; color: var(--text-light); padding: 6px; margin-left: -6px; cursor: pointer; border-radius: 8px; transition: background 0.2s, color 0.2s; display: flex; align-items: center; justify-content: center; }
.media-player-wrapper .submenu-back-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.media-player-wrapper .submenu-back-btn svg { width: 22px; height: 22px; fill: currentColor; }
.media-player-wrapper .submenu-header h4 { margin: 0; padding: 0 0 0 8px; flex-grow: 1; font-weight: 600; font-size: 0.95rem; color: #fff; letter-spacing: 0.2px; }
.media-player-wrapper #add-custom-sleep-btn:hover { background: rgba(255, 255, 255, 0.2) !important; }
.media-player-wrapper #add-custom-sleep-btn svg { width: 100%; height: 100%; }

.media-player-wrapper .speed-option, .media-player-wrapper .quality-option,
.media-player-wrapper .subtitle-option, .media-player-wrapper .sleep-option { position: relative; }
.media-player-wrapper .speed-option.active, .media-player-wrapper .quality-option.active,
.media-player-wrapper .subtitle-option.active, .media-player-wrapper .sleep-option.active { color: var(--brand); font-weight: 600; background: rgba(139, 92, 246, 0.1); }

/* Toggles & Sliders */
.media-player-wrapper .toggle-switch.small { position: relative; display: inline-block; width: 36px; height: 20px; }
.media-player-wrapper .toggle-switch.small input { opacity: 0; width: 0; height: 0; }
.media-player-wrapper .toggle-switch.small .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.15); border-radius: 20px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); }
.media-player-wrapper .toggle-switch.small .slider:before { position: absolute; content: ''; height: 16px; width: 16px; left: 2px; top: 50%; transform: translateY(-50%); background-color: white; border-radius: 50%; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.media-player-wrapper .toggle-switch.small input:checked + .slider { background-color: var(--brand); box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); }
.media-player-wrapper .toggle-switch.small input:checked + .slider:before { transform: translate(16px, -50%); }
.media-player-wrapper .menu-item .toggle-switch { pointer-events: none; }

/* --- OTHER UI ELEMENTS --- */
.media-player-wrapper .player-toast-notification {
  position: absolute; top: 20px; right: 20px; padding: 10px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 500;
  z-index: 35; opacity: 0; transform: translateY(-20px); visibility: hidden; transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
}
.media-player-wrapper .player-toast-notification.show { opacity: 1; transform: translateY(0); visibility: visible; }

.media-player-wrapper .shortcuts-modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 40; display: flex; align-items: center; justify-content: center; padding: 1rem; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; }
.media-player-wrapper .shortcuts-modal-overlay.is-visible { opacity: 1; visibility: visible; }
.media-player-wrapper .shortcuts-modal { width: 100%; max-width: 420px; padding: 1.5rem; border-radius: 16px; text-align: left; position: relative; transform: scale(0.95); transition: transform 0.3s; }
.media-player-wrapper .shortcuts-modal-overlay.is-visible .shortcuts-modal { transform: scale(1); }
.media-player-wrapper .shortcuts-modal h3 { margin: 0 0 1.5rem; font-size: 1.25rem; }
.media-player-wrapper .shortcuts-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 420px) { .media-player-wrapper .shortcuts-grid { grid-template-columns: 1fr 1fr; } }
.media-player-wrapper .shortcut-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--glass-border); font-size: 0.9rem; }
.media-player-wrapper .shortcut-item kbd { font-family: monospace; background: rgba(0,0,0,0.3); padding: 0.2rem 0.5rem; border-radius: 6px; border: 1px solid var(--glass-border); margin-left: 0.25rem; }

.media-player-wrapper .seek-preview { position: absolute; bottom: 25px; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; transform: translateX(-50%); display: none; pointer-events: none; }
.media-player-wrapper .seek-bar-container:hover .seek-preview { display: block; }

.media-player-wrapper .player-tooltip {
  position: absolute;
  bottom: 85px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 100;
  white-space: nowrap;
}

.media-player-wrapper .player-tooltip.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.media-player-wrapper .gesture-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 35%;
  background: rgba(255, 255, 255, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  font-weight: 500;
  font-size: 0.9rem;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  overflow: hidden;
}
.media-player-wrapper .gesture-indicator.left {
  left: 0;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}
.media-player-wrapper .gesture-indicator.right {
  right: 0;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}
.media-player-wrapper .gesture-indicator.animate { animation: mpc-gesture-pop 0.5s ease-out; }
.media-player-wrapper .gesture-indicator svg { width: 32px; height: 32px; }
@keyframes mpc-gesture-pop {
  0% { opacity: 0; background: rgba(255,255,255,0); }
  20% { opacity: 1; background: rgba(255,255,255,0.15); }
  80% { opacity: 1; background: rgba(255,255,255,0.1); }
  100% { opacity: 0; background: rgba(255,255,255,0); }
}

.media-player-wrapper .volume-indicator { position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 12px; height: 120px; border-radius: 8px; display: flex; align-items: flex-end; padding: 3px; z-index: 3; opacity: 0; transition: opacity 0.3s ease-out; pointer-events: none; }
.media-player-wrapper .volume-indicator.active { opacity: 1; }
.media-player-wrapper .volume-level { width: 100%; background: white; border-radius: 6px; box-shadow: 0 0 10px rgba(255,255,255,0.6); }

.media-player-wrapper .network-status-popup { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(239, 68, 68, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color: white; padding: 1rem 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; gap: 0.75rem; z-index: 30; font-weight: 600; animation: mpc-fade-in 0.3s ease-out; }
.media-player-wrapper .network-status-popup .icon svg { width: 24px; height: 24px; }

.media-player-wrapper .player-error-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 15, 20, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 35;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-player-wrapper .player-error-overlay.active {
  opacity: 1;
  visibility: visible;
}

.media-player-wrapper .error-icon {
  width: 64px;
  height: 64px;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 16px;
  border-radius: 50%;
  animation: mpc-error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.media-player-wrapper .error-message {
  font-size: 1.1rem;
  font-weight: 500;
  color: #f1f5f9;
  max-width: 400px;
  line-height: 1.5;
}

.media-player-wrapper .error-retry-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 99px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.media-player-wrapper .error-retry-btn:hover {
  background: white;
  color: black;
  transform: translateY(-2px);
}

@keyframes mpc-error-shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.media-player-wrapper .loader-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, transparent 70%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 150;
  gap: 20px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-player-wrapper .loader-overlay.active {
  opacity: 1;
  pointer-events: none;
}

.media-player-wrapper .loader-triangle { 
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid white;
  animation: mpc-spin 1.2s linear infinite;
  transform-origin: 50% 66.6%;
  /* Hardware acceleration hints */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  /* Smoother drop-shadow performance */
  filter: drop-shadow(0 0 12px rgba(255,255,255,0.3));
}

.media-player-wrapper .loader-percentage {
  font-family: var(--f-mono);
  font-size: 16px;
  font-weight: 600;
  color: white;
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
  letter-spacing: 1px;
}

@keyframes mpc-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.media-player-wrapper .pip-btn { display: none; }
.media-player-wrapper .pip-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
.media-player-wrapper .pip-btn.is-pip,
.media-player-wrapper #mobile-pip-btn.is-pip { color: var(--brand); }

.media-player-wrapper .pip-large-rect,
.media-player-wrapper .pip-small-rect {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-player-wrapper .pip-btn.is-pip .pip-large-rect,
.media-player-wrapper #mobile-pip-btn.is-pip .pip-large-rect {
  x: 12px; y: 11px; width: 8px; height: 5px; rx: 1px; ry: 1px;
}

.media-player-wrapper .pip-btn.is-pip .pip-small-rect,
.media-player-wrapper #mobile-pip-btn.is-pip .pip-small-rect {
  x: 2px; y: 3px; width: 20px; height: 14px; rx: 2px; ry: 2px;
}

/* Modals & Fullscreen */
.media-player-wrapper .fullscreen-title-overlay { position: absolute; top: 0; left: 0; right: 0; padding: 1.5rem 2rem; background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent); z-index: 4; font-weight: 700; font-size: 1.5rem; opacity: 0; visibility: hidden; transition: all 0.3s; }
.media-player-wrapper .media-player-component:fullscreen .text-content { display: none; }
.media-player-wrapper .media-player-component:fullscreen .player-container.is-active:hover .fullscreen-title-overlay,
.media-player-wrapper .media-player-component:fullscreen .player-container.is-paused .fullscreen-title-overlay { opacity: 1; visibility: visible; }

/* Misc */
.media-player-wrapper .media-player-component.is-ambient .ambient-canvas { opacity: var(--ambient-opacity, 1); visibility: visible; }
.media-player-wrapper .media-player-component.is-ambient { background: transparent; border-color: transparent; }
.media-player-wrapper .media-player-component.is-ambient .player-container { box-shadow: 0 0 50px rgba(0,0,0,0.8); }
.media-player-wrapper .ambient-canvas { 
  position: absolute; 
  top: -15%; 
  left: -15%; 
  width: 130%; 
  height: 130%; 
  display: block;
  object-fit: cover;
  z-index: 0; 
  filter: blur(var(--ambient-blur, 80px)) brightness(0.8) saturate(var(--ambient-sat, 1.4)); 
  opacity: 0; 
  visibility: hidden;
  transform: translate3d(0,0,0) scale(var(--ambient-scale, 1.1));
  transition: opacity 1.5s ease, visibility 1.5s ease; 
  pointer-events: none;
  will-change: opacity, filter;
}
.media-player-wrapper .annotations-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 6; pointer-events: none; overflow: hidden; font-family: sans-serif; }
.media-player-wrapper .annotation { 
  position: absolute; 
  padding: 0.6em 1.2em; 
  border-radius: 12px; 
  font-size: clamp(0.75rem, 2cqi, 1rem); 
  opacity: 0; 
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease; 
  pointer-events: all;
  background: rgba(15, 15, 20, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.1);
  color: white;
  font-weight: 500;
  transform: translateY(10px);
}
.media-player-wrapper .annotation.visible { opacity: 1; transform: translateY(0); }
.media-player-wrapper .annotation a { color: #60a5fa; text-decoration: none; }
.media-player-wrapper .annotation.position-top-left { top: 20px; left: 20px; }
.media-player-wrapper .annotation.position-top-center { top: 20px; left: 50%; transform: translateX(-50%); }
.media-player-wrapper .annotation.position-top-right { top: 20px; right: 20px; }
.media-player-wrapper .annotation.position-center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
.media-player-wrapper .annotation.position-bottom-left { bottom: 80px; left: 20px; }
.media-player-wrapper .annotation.position-bottom-center { bottom: 80px; left: 50%; transform: translateX(-50%); }
.media-player-wrapper .annotation.position-bottom-right { bottom: 80px; right: 20px; }
.media-player-wrapper .video-details-wrapper { padding: 3rem 2rem; background: var(--bg-light); border-top: 1px solid rgba(255,255,255,0.08); border-radius: 0 0 16px 16px; box-shadow: inset 0 20px 40px rgba(0,0,0,0.2); }
.media-player-wrapper .text-content.has-metadata { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 3rem; }
@media (min-width: 992px) { .media-player-wrapper .text-content.has-metadata { grid-template-columns: 2fr 1fr; } }
.media-player-wrapper .text-content.no-metadata { max-width: 800px; margin: 0 auto; display: block; }
.media-player-wrapper .video-title { margin: 0 0 1rem; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1.1; }
.media-player-wrapper .video-description-container { position: relative; }
.media-player-wrapper .video-description-container::before { content: ''; position: absolute; left: -24px; top: 0; bottom: 0; width: 4px; background: var(--brand); border-radius: 2px; opacity: 0.5; }
.media-player-wrapper .text-content .description { margin: 0; color: #94a3b8; font-size: 1.1rem; line-height: 1.7; font-weight: 400; max-width: 70ch; }
.media-player-wrapper .credits-section { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
.media-player-wrapper .credit-line { font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.25rem; }
.media-player-wrapper .credit-label { color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em; opacity: 0.8; }
.media-player-wrapper .credit-values { color: #f1f5f9; font-weight: 500; }
.media-player-wrapper .metadata-info { display: flex; flex-direction: column; gap: 2rem; }
.media-player-wrapper .credit-line a { color: var(--brand); text-decoration: none; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border-bottom: 1px solid transparent; }
.media-player-wrapper .credit-line a:hover { color: #fff; border-bottom-color: var(--brand); }

/* --- RESPONSIVE ADJUSTMENTS --- */

@media (max-width: 767px) {
  .media-player-wrapper .bottom-controls-wrapper { 
    padding: 0 0 12px 0;
  }
  .media-player-wrapper .custom-controls { padding: 0 12px; }
  
  /* REDESIGNED MOBILE MENU: Clean Floating Panel inside the player */
  .media-player-wrapper .settings-menu-container { 
    position: absolute; 
    bottom: calc(100% + 12px); 
    right: -4px; /* Slight offset to account for control padding */
    width: 260px; 
    max-width: calc(100vw - 48px);
    border-radius: 16px;
    z-index: 99;
    /* Ensure it doesn't exceed player height */
    max-height: calc(100cqh - 80px);
    display: flex;
    flex-direction: column;
  }
  
  .media-player-wrapper .menu-item {
    padding: 8px 6px;
    font-size: 0.85rem;
  }
  
  .media-player-wrapper .submenu-header h4 {
    font-size: 0.9rem;
    padding: 4px 8px;
  }
  
  .media-player-wrapper .settings-menu ul { 
    max-height: min(200px, calc(100cqh - 100px)); 
  }
  
  .media-player-wrapper .top-controls { padding: 12px; }
}

@media (max-width: 600px) {
  .media-player-wrapper .pip-btn { display: none !important; }
  .media-player-wrapper .pip-setting-item { display: flex !important; }
}

@media (max-width: 480px) {
  .media-player-wrapper .bottom-controls-wrapper { padding: 0 0 8px 0; gap: 8px; }
  .media-player-wrapper .custom-controls { gap: 6px; padding: 0 8px; }
  .media-player-wrapper .time-and-seek { gap: 4px; padding: 0; margin-left: 4px; }
  .media-player-wrapper .custom-controls .settings-group > button, 
  .media-player-wrapper .custom-controls > button { width: 40px; height: 40px; padding: 0; }
  .media-player-wrapper .custom-controls button svg { width: 20px; height: 20px; }
}

@media (max-width: 380px) {
  /* removed duration hide so it displays */
}

@media (min-width: 768px) {
  .media-player-wrapper .settings-menu-container { width: 280px; }
}

@media (min-width: 1920px) {
  .media-player-wrapper .media-player-component { font-size: 1.1rem; border-radius: 24px; }
}
`;

function getCss() {
  return cssString;
}

module.exports = { getCss };
