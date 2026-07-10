// File: api/component.html.js

// // All your standard SVG icons guaranteed to be preserved
const playIcon = `<svg viewBox="0 0 24 24" fill="currentColor" style="transform: translateX(1px);"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const pauseIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const warningIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const forwardIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg>`;
const backwardIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg>`;
const volumeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
const muteIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const fullscreenIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>`;
const fullscreenExitIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>`;
const pipIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect class="pip-large-rect" x="2" y="3" width="20" height="14" rx="2" ry="2"/><rect class="pip-small-rect" x="12" y="11" width="8" height="5" rx="1" ry="1"/></svg>`;
const settingsIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ambientIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
const annotationsIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></svg>`;
const subtitlesIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="7" y1="14" x2="11" y2="14"/></svg>`;
const sleepIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const plusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const qualityIcon =  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const backIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const stableVolIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>`;
const shareIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`;
const loopIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`;
const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const hdrIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const paletteIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.5 2 12 2z"/></svg>`;
const whatsappIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
const linkedinIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const emailIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
const twitterIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
const facebookIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
const githubIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
const websiteIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const infoIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
const saveIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`;
const loadIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

const chevronRightIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

function getLogoSVG(uniqueId) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%" style="display: block; border-radius: inherit;">
  <defs>
    <!-- Dark Obsidian Background -->
    <linearGradient id="logo-${uniqueId}-bgFast" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05050A" />
      <stop offset="50%" stop-color="#0F0F1A" />
      <stop offset="100%" stop-color="#020205" />
    </linearGradient>

    <!-- Ambient Orbs for the Aura -->
    <radialGradient id="logo-${uniqueId}-orbMagenta" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FF0066" stop-opacity="1" />
      <stop offset="100%" stop-color="#FF0066" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="logo-${uniqueId}-orbCyan" cx="60%" cy="60%" r="60%">
      <stop offset="0%" stop-color="#00FFFF" stop-opacity="1" />
      <stop offset="100%" stop-color="#00FFFF" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="logo-${uniqueId}-orbViolet" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#6600FF" stop-opacity="1" />
      <stop offset="100%" stop-color="#6600FF" stop-opacity="0" />
    </radialGradient>

    <!-- Dynamic Edge for the Glass Bevel -->
    <linearGradient id="logo-${uniqueId}-glassEdge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
      <stop offset="25%" stop-color="#FFFFFF" stop-opacity="0.1" />
      <stop offset="70%" stop-color="#FFFFFF" stop-opacity="0.0" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.5" />
    </linearGradient>

    <!-- Specular Highlight for the Glass Surface -->
    <linearGradient id="logo-${uniqueId}-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.0" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <filter id="logo-${uniqueId}-auraBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="45" />
    </filter>

    <filter id="logo-${uniqueId}-internalBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="28" />
    </filter>

    <!-- Multi-layered physical drop shadow -->
    <filter id="logo-${uniqueId}-dropShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="28" stdDeviation="35" flood-color="#000000" flood-opacity="0.85"/>
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
    </filter>

    <!-- The perfect optically weighted play button path -->
    <path id="logo-${uniqueId}-playIcon" d="M 215,152 C 199,142 180,153 180,171 L 180,341 C 180,359 199,370 215,360 L 355,275 C 370,266 370,246 355,237 Z" />
    
    <clipPath id="logo-${uniqueId}-playClip">
      <use href="#logo-${uniqueId}-playIcon" />
    </clipPath>
  </defs>

  <!-- Base Plate -->
  <rect width="512" height="512" rx="114" fill="url(#logo-${uniqueId}-bgFast)" />
  
  <!-- Outer Border / Bevel for the App Icon itself -->
  <rect width="510" height="510" x="1" y="1" rx="113" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2" />
  <rect width="508" height="508" x="2" y="2" rx="112" fill="none" stroke="#000000" stroke-opacity="0.5" stroke-width="2" />

  <!-- Backlight Auras (Projects light behind the button) -->
  <g filter="url(#logo-${uniqueId}-auraBlur)">
    <circle cx="180" cy="180" r="140" fill="url(#logo-${uniqueId}-orbMagenta)" opacity="0.65" />
    <circle cx="350" cy="256" r="160" fill="url(#logo-${uniqueId}-orbCyan)" opacity="0.75" />
    <circle cx="210" cy="360" r="150" fill="url(#logo-${uniqueId}-orbViolet)" opacity="0.8" />
  </g>

  <!-- Glass Play Button Base & Shadows -->
  <use href="#logo-${uniqueId}-playIcon" fill="#06060A" filter="url(#logo-${uniqueId}-dropShadow)" opacity="0.9" />

  <!-- Refracted Glass Interior -->
  <g clip-path="url(#logo-${uniqueId}-playClip)">
    <!-- Base translucency -->
    <rect x="0" y="0" width="512" height="512" fill="#FFFFFF" opacity="0.02" />

    <!-- Internal Refractions (Simulated lens effect by duplicating, intensifying, and shifting the auras) -->
    <g filter="url(#logo-${uniqueId}-internalBlur)">
      <circle cx="130" cy="130" r="150" fill="#FF0066" opacity="0.9" />
      <circle cx="390" cy="270" r="180" fill="#00FFFF" opacity="1.0" />
      <circle cx="180" cy="400" r="160" fill="#6600FF" opacity="1.0" />
      <!-- Hot core highlight to simulate crystalline thickness -->
      <circle cx="280" cy="230" r="90" fill="#FFFFFF" opacity="0.5" />
    </g>

    <!-- Diagonal acrylic streaks to provide physical texture inside the glass -->
    <g opacity="0.04" stroke="#FFFFFF" stroke-width="70" transform="rotate(-25 256 256)">
      <path d="M -200,-100 L 700,800" />
      <path d="M -50,-100 L 850,800" />
      <path d="M 100,-100 L 1000,800" />
    </g>

    <!-- Specular Surface Gloss Overlay -->
    <use href="#logo-${uniqueId}-playIcon" fill="url(#logo-${uniqueId}-gloss)" />
  </g>

  <!-- Crisp Polished Glass Edge bounding the play icon -->
  <!-- This is drawn on top with a precise gradient to mimic a machined bevel -->
  <use href="#logo-${uniqueId}-playIcon" fill="none" stroke="url(#logo-${uniqueId}-glassEdge)" stroke-width="4.5" />
  
  <!-- "HDR" Premium Badge/Label at the bottom right or centered -->
  <g transform="translate(256, 430)">
    <!-- HDR Badge Box with intense glow -->
    <rect x="-45" y="-18" width="90" height="36" rx="8" fill="#000000" opacity="0.6" filter="url(#logo-${uniqueId}-dropShadow)" />
    <rect x="-45" y="-18" width="90" height="36" rx="8" fill="none" stroke="url(#logo-${uniqueId}-glassEdge)" stroke-width="1.5" />
    
    <!-- Neon HDR Text -->
    <text x="0" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" letter-spacing="4" text-anchor="middle" filter="url(#logo-${uniqueId}-internalBlur)">HDR</text>
    <text x="0" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" letter-spacing="4" text-anchor="middle">HDR</text>
  </g>
</svg>
`;
}

function getHtml(props) {
  const { 
    uniqueId, 
    thumbnailSrc, 
    videoSrc, 
    title, 
    description, 
    writers, directors, stars, watermark, subtitles, subtitlesAppearance,
    ambientConfig,
    shareUrl,
    shareText,
    maxWidth,
    aspectRatio,
    radius,
    version,
    // Flexible Controls Configuration via Props
    controls = {}
  } = props;

  // Set default configurations for controls if missing and normalize booleans
  const normalize = (val, def) => (val === true || val === 'true') ? true : (val === false || val === 'false' ? false : def);
  const c = {
    pip: normalize(controls.pip, true),
    fullscreen: normalize(controls.fullscreen, true),
    mute: normalize(controls.mute, true),
    settings: normalize(controls.settings, true),
    speed: normalize(controls.speed, true),
    quality: normalize(controls.quality, true),
    subtitles: normalize(controls.subtitles, false),
    ambient: normalize(controls.ambient, ambientConfig !== null && ambientConfig !== undefined),
    hdr: normalize(controls.hdr, false),
    colorEnhance: normalize(controls.colorEnhance, false),
    annotations: normalize(controls.annotations, true),
    sleep: normalize(controls.sleep, true),
    stableVolume: normalize(controls.stableVolume, true),
    loop: normalize(controls.loop, true),
    shortcuts: normalize(controls.shortcuts, true),
    network: normalize(controls.network, true),
    share: normalize(controls.share, true),
    brand: normalize(controls.brand, true)
  };

  let watermarkHTML = '';
  if (watermark && watermark.imageUrl) {
    const watermarkStyle = `
      opacity: ${watermark.opacity || 0.7}; 
      width: ${watermark.width ? (typeof watermark.width === 'number' ? watermark.width + 'px' : watermark.width) : '120px'};
      border-radius: ${watermark.borderRadius ? (typeof watermark.borderRadius === 'number' ? watermark.borderRadius + 'px' : watermark.borderRadius) : '0px'};
    `.replace(/\s+/g, ' ').trim();

    watermarkHTML = `<div class="player-watermark position-${watermark.position || 'top-right'}" style="${watermarkStyle}">
      <a href="${watermark.clickUrl || '#'}" target="_blank" rel="noopener">
        <img src="${watermark.imageUrl}" alt="Watermark" style="border-radius: inherit;">
      </a>
    </div>`;
  }

  const subtitleTracksHTML = (subtitles || []).map(track =>
    `<track label="${track.label}" kind="subtitles" srclang="${track.srclang}" src="${track.src}" ${track.default ? 'default' : ''}>`
  ).join('');

  const titleHTML = title ? `<h1 class="video-title">${title}</h1>` : '';
  const descHTML = description ? `<div class="video-description-container"><p class="description">${description}</p></div>` : '';
  const createCreditLine = (label, items) => (items && items.length > 0) ? `<div class="credit-line"><span class="credit-label">${label}</span><span class="credit-values">${items.map(i => `<a href="${i.url || '#'}" target="_blank" rel="noopener">${i.name}</a>`).join(', ')}</span></div>` : '';
  const creditsHTML = [createCreditLine('Writers', writers), createCreditLine('Directors', directors), createCreditLine('Stars', stars)].filter(Boolean).join('');
  const metadataHTML = creditsHTML ? `
    <div class="metadata-info">
      <div class="credits-section">
        ${creditsHTML}
      </div>
    </div>
  ` : '';

  const textContentHTML = (titleHTML || descHTML || creditsHTML) ? `
    <div class="video-details-wrapper">
      <div class="text-content ${creditsHTML ? 'has-metadata' : 'no-metadata'}">
        <div class="main-info">
          ${titleHTML}
          ${descHTML}
        </div>
        ${metadataHTML}
      </div>
    </div>
  ` : '';

  const activityIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
  
  // Dynamic Element Rendering
  const topSleepHTML = c.sleep ? `<div class="sleep-timer-display glass-panel pill-panel" id="top-sleep-timer" style="display: none;">${sleepIcon}<span class="time" id="sleep-timer-countdown">Off</span></div>` : '';
  const topEnhancementsHTML = `
    <div class="quality-badge hdr-tag" style="display: none;">HDR</div>
    <div class="quality-badge color-enhance-tag" style="display: none;">COLOR PRO</div>
  `;
  const topCcHTML = c.subtitles ? `<button class="top-cc-btn glass-panel pill-panel" id="top-cc-btn" data-tooltip="Toggle Subtitles/CC (c)">${subtitlesIcon}</button>` : '';
  const topNetworkHTML = c.network ? `<div class="network-speed-indicator glass-panel pill-panel" id="network-speed-indicator" data-tooltip="Network Statistics (s)">${activityIcon}<span class="speed-text" id="network-speed-text">0 KB/s</span></div>` : '';
  
  const playerBrandHTML = c.brand ? `
    <div class="player-brand-header glass-panel pill-panel" style="display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; pointer-events: auto;">
      <div class="player-logo" style="width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); overflow: hidden;">
        ${getLogoSVG(uniqueId)}
      </div>
      <span class="player-name" style="font-weight: 600; font-size: 0.85rem; color: #fff;">${title || 'FlexPlayer'}</span>
    </div>
  ` : '';
  
  const muteBtnHTML = c.mute ? `<button class="mute-btn glass-panel" data-tooltip="Mute/Unmute (m)">${volumeIcon}${muteIcon}</button>` : '';
  const pipBtnHTML = c.pip ? `<button class="pip-btn glass-panel" data-tooltip="Picture-in-Picture (p)" disabled>${pipIcon}</button>` : '';
  const fullscreenBtnHTML = c.fullscreen ? `<button class="fullscreen-btn glass-panel" data-tooltip="Fullscreen (f)">${fullscreenIcon}${fullscreenExitIcon}</button>` : '';

  const settingsMenuHTML = c.settings ? `
    <div class="settings-group">
      <button class="settings-btn glass-panel" data-tooltip="Settings (comma)" style="position: relative;">
        ${settingsIcon}
        <span id="speed-badge" style="position: absolute; top: -6px; right: -6px; background: rgba(255,255,255,0.1); color: white; font-size: 10px; font-weight: 700; border-radius: 4px; padding: 2px 4px; pointer-events: none; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(4px); display: none;"></span>
      </button>
      <div class="settings-menu-container glass-panel">
        <div class="settings-menu main-menu"><ul id="main-menu-list">
          ${c.mute ? `<li class="menu-item responsive-setting mute-setting-item" id="mobile-mute-btn"><span class="icon">${volumeIcon}${muteIcon}</span><span class="label">Mute / Unmute</span><label class="toggle-switch small"><input type="checkbox" id="mobile-mute-toggle"><span class="slider"></span></label></li>` : ''}
          ${c.pip ? `<li class="menu-item responsive-setting pip-setting-item" id="mobile-pip-btn"><span class="icon">${pipIcon}</span><span class="label">Picture-in-Picture</span><label class="toggle-switch small"><input type="checkbox" id="mobile-pip-toggle"><span class="slider"></span></label></li>` : ''}
          ${c.stableVolume ? `<li class="menu-item"><span class="icon">${stableVolIcon}</span><span class="label">Stable Volume</span><label class="toggle-switch small"><input type="checkbox" id="stable-volume-toggle"><span class="slider"></span></label></li>` : ''}
          <li class="menu-item"><span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 7v10"/><path d="M22 10v4"/><path d="M7 7v10"/><path d="M2 10v4"/></svg></span><span class="label">Audio Waveform</span><label class="toggle-switch small"><input type="checkbox" id="waveform-toggle" checked><span class="slider"></span></label></li>
          ${c.loop ? `<li class="menu-item"><span class="icon">${loopIcon}</span><span class="label">Loop Video</span><label class="toggle-switch small"><input type="checkbox" id="loop-toggle"><span class="slider"></span></label></li>` : ''}
          ${c.hdr ? `<li class="menu-item"><span class="icon">${hdrIcon}</span><span class="label">HDR Video</span><label class="toggle-switch small"><input type="checkbox" id="hdr-toggle"><span class="slider"></span></label></li>` : ''}
          ${c.colorEnhance ? `<li class="menu-item"><span class="icon">${paletteIcon}</span><span class="label">Color Enhancement</span><label class="toggle-switch small"><input type="checkbox" id="color-enhance-toggle"><span class="slider"></span></label></li>` : ''}
          ${c.ambient ? `<li class="menu-item"><span class="icon">${ambientIcon}</span><span class="label">Ambient mode</span><label class="toggle-switch small"><input type="checkbox" id="ambient-toggle"><span class="slider"></span></label></li>` : ''}
          ${c.share ? `<li class="menu-item menu-nav-item" data-target-menu="share"><span class="icon">${shareIcon}</span><span class="label">Share</span><span class="nav-chevron">${chevronRightIcon}</span></li>` : ''}
          ${c.annotations ? `<li class="menu-item"><span class="icon">${annotationsIcon}</span><span class="label">Annotations</span><label class="toggle-switch small"><input type="checkbox" id="annotations-toggle" checked><span class="slider"></span></label></li>` : ''}
          ${c.subtitles ? `<li class="menu-item menu-nav-item" data-target-menu="subtitles"><span class="icon">${subtitlesIcon}</span><span class="label">Subtitles/CC</span><span class="value" id="current-subtitle-label">Off</span><span class="nav-chevron">${chevronRightIcon}</span></li>` : ''}
          ${c.sleep ? `<li class="menu-item menu-nav-item" data-target-menu="sleep"><span class="icon">${sleepIcon}</span><span class="label">Sleep timer</span><span class="value" id="current-sleep-label">Off</span><span class="nav-chevron">${chevronRightIcon}</span></li>` : ''}
          ${c.speed ? `<li class="menu-item menu-nav-item" data-target-menu="speed"><span class="icon">${playIcon}</span><span class="label">Playback speed</span><span class="value" id="current-speed-label">Normal</span><span class="nav-chevron">${chevronRightIcon}</span></li>` : ''}
          ${c.quality ? `<li class="menu-item menu-nav-item" data-target-menu="quality" style="display: none;"><span class="icon">${qualityIcon}</span><span class="label">Quality</span><span class="value" id="current-quality-label">Auto</span><span class="nav-chevron">${chevronRightIcon}</span></li>` : ''}
          ${c.shortcuts ? `<li class="menu-item" id="shortcuts-menu-btn"><span class="icon">${warningIcon}</span><span class="label">Keyboard shortcuts</span></li>` : ''}
        </ul></div>
        ${c.speed ? `<div class="settings-menu speed-menu"><div class="submenu-header"><button class="submenu-back-btn">${backIcon}</button><h4>Playback speed</h4></div><ul id="speed-menu-list"><li class="menu-item speed-option" data-speed="0.5">0.5x</li><li class="menu-item speed-option" data-speed="0.75">0.75x</li><li class="menu-item speed-option" data-speed="1">Normal</li><li class="menu-item speed-option" data-speed="1.25">1.25x</li><li class="menu-item speed-option" data-speed="1.5">1.5x</li><li class="menu-item speed-option" data-speed="2">2x</li></ul></div>` : ''}
        ${c.quality ? `<div class="settings-menu quality-menu"><div class="submenu-header"><button class="submenu-back-btn">${backIcon}</button><h4>Quality</h4></div><ul id="quality-menu-list"></ul></div>` : ''}
        ${c.share ? `
          <div class="settings-menu share-menu">
            <div class="submenu-header"><button class="submenu-back-btn">${backIcon}</button><h4>Share Video</h4></div>
            <ul id="share-menu-list">
              <li class="menu-item share-option" data-platform="twitter">
                <span class="icon">${twitterIcon}</span>
                <span class="label">Share on X (Twitter)</span>
              </li>
              <li class="menu-item share-option" data-platform="facebook">
                <span class="icon">${facebookIcon}</span>
                <span class="label">Share on Facebook</span>
              </li>
              <li class="menu-item share-option" data-platform="whatsapp">
                <span class="icon">${whatsappIcon}</span>
                <span class="label">Share on WhatsApp</span>
              </li>
              <li class="menu-item share-option" data-platform="linkedin">
                <span class="icon">${linkedinIcon}</span>
                <span class="label">Share on LinkedIn</span>
              </li>
              <li class="menu-item share-option" data-platform="email">
                <span class="icon">${emailIcon}</span>
                <span class="label">Send via Email</span>
              </li>
              <li class="menu-item share-option" data-platform="copy">
                <span class="icon">${copyIcon}</span>
                <span class="label">Copy Link</span>
              </li>
            </ul>
          </div>
        ` : ''}
        ${c.subtitles ? `<div class="settings-menu subtitles-menu"><div class="submenu-header"><button class="submenu-back-btn">${backIcon}</button><h4>Subtitles/CC</h4></div><ul id="subtitles-menu-list"></ul></div>` : ''}
        ${c.sleep ? `<div class="settings-menu sleep-menu"><div class="submenu-header"><button class="submenu-back-btn">${backIcon}</button><h4>Sleep Timer</h4><button id="add-custom-sleep-btn" style="background: rgba(255, 255, 255, 0.1); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 6px; margin-right: 4px;"><span style="display: block; width: 20px; height: 20px;">${plusIcon}</span></button></div><ul><li class="menu-item sleep-option" data-time="0">Off</li><li class="menu-item sleep-option" data-time="900">15 minutes</li><li class="menu-item sleep-option" data-time="1800">30 minutes</li><li class="menu-item sleep-option" data-time="3600">60 minutes</li></ul></div>
        <div class="settings-menu custom-sleep-menu"><div class="submenu-header"><button class="submenu-back-btn back-to-sleep-btn">${backIcon}</button><h4>Custom Timer</h4><button id="custom-sleep-submit" style="background: none; border: none; color: var(--brand); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 6px; font-weight: 600;">Start</button></div>
        <div class="roller-container" style="display: flex; height: 180px; overflow: hidden; align-items: stretch; justify-content: space-evenly; width: 100%; position: relative; margin-top: 10px;">
          <div style="position: absolute; top: 50%; left: 10px; right: 10px; height: 40px; transform: translateY(-50%); background: rgba(255,255,255,0.1); border-radius: 8px; pointer-events: none; z-index: 0;"></div>
          <div style="flex: 1; position: relative; z-index: 1;"><ul id="roller-hours"></ul></div>
          <div style="flex: 1; position: relative; z-index: 1;"><ul id="roller-minutes"></ul></div>
          <div style="flex: 1; position: relative; z-index: 1;"><ul id="roller-seconds"></ul></div>
        </div>
        <div class="roller-labels" style="display: flex; justify-content: space-evenly; text-align: center; color: rgba(255,255,255,0.6); font-size: 0.8rem; padding-bottom: 20px;">
          <span style="flex: 1;">h</span><span style="flex: 1;">m</span><span style="flex: 1;">s</span>
        </div></div>` : ''}
      </div>
    </div>
  ` : '';

  const ac = { 
    bleed: true, 
    opacity: 1.0, 
    blur: 80, 
    saturation: 1.4, 
    scale: 1.2, 
    ...(ambientConfig || {}) 
  };
  const sa = {
    fontSize: '18px',
    color: '#ffffff',
    background: '#000000',
    bgOpacity: 0.5,
    ...(subtitlesAppearance || {})
  };
  
  const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  };

  const dynamicStyles = `
    #${uniqueId} {
      --ambient-opacity: ${ac.opacity};
      --ambient-blur: ${ac.blur}px;
      --ambient-sat: ${ac.saturation};
      --ambient-scale: ${ac.scale};
      ${maxWidth ? `max-width: ${maxWidth};` : ''}
      margin: 0 auto;
    }
    #${uniqueId}.media-player-component {
       overflow: ${(ac.bleed === true || ac.bleed === 'true' || ac.bleed === 'both') ? 'visible' : 'hidden'} !important;
       contain: none !important;
       ${radius !== undefined ? `border-radius: ${radius}px;` : ''}
    }
    #${uniqueId} .player-container {
       background: ${(ac.bleed === 'false' || ac.bleed === 'both' || ac.bleed === 'true') ? 'transparent' : 'var(--bg-dark)'};
       ${aspectRatio ? `aspect-ratio: ${aspectRatio === 'auto' ? '16 / 9' : aspectRatio};` : ''}
       ${radius !== undefined ? `border-radius: ${radius}px;` : ''}
    }
    #${uniqueId} ::cue {
      font-size: ${sa.fontSize};
      color: ${sa.color};
      background: rgba(${hexToRgb(sa.background)}, ${sa.bgOpacity});
    }
  `;

  return `
    <div class="media-player-component" id="${uniqueId}">
      <style>
        ${dynamicStyles}
        #${uniqueId} .ad-skip-btn:hover { background: rgba(255,255,255,0.25) !important; transform: translateY(-1px); }
        #${uniqueId} .ad-skip-btn:active { transform: translateY(1px) scale(0.98); }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.10/hls.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.7.1/dash.all.min.js"></script>
      <canvas class="ambient-canvas"></canvas>
      <div class="player-container">
        <div class="ad-container" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 100; background: #000;">
          <a class="ad-click-through" href="#" target="_blank" rel="noopener" style="position: absolute; top: 0; left: 0; width: 100%; height: calc(100% - 60px); z-index: 101;"></a>
          <video class="ad-video" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none;" playsinline></video>
          <div class="ad-bottom-bar" style="position: absolute; bottom: 40px; left: 30px; display: flex; gap: 12px; z-index: 102; align-items: center;">
            <div class="ad-indicator" style="padding: 10px 16px; font-weight: 600; font-size: 14px; font-family: 'Inter', system-ui, sans-serif; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color: rgba(255,255,255,0.95); border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 16px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px;">
               <span style="display:inline-block; width: 8px; height: 8px; background: #eab308; border-radius: 50%; box-shadow: 0 0 8px rgba(234,179,8,0.8);"></span> 
               <span class="ad-indicator-text">Ad</span>
            </div>
            <button class="ad-skip-btn" style="display: none; padding: 10px 20px; font-weight: 600; font-size: 14px; font-family: 'Inter', system-ui, sans-serif; cursor: pointer; border: 1px solid rgba(255,255,255,0.25); background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color: white; border-radius: 20px; box-shadow: 0 8px 16px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
                Skip Ad
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
            </button>
          </div>
        </div>
        <div class="player-error-overlay glass-panel">
          <div class="error-icon">${warningIcon}</div>
          <div class="error-message">An unexpected error occurred</div>
          <button class="error-retry-btn glass-panel">Retry Playback</button>
        </div>
        <img src="${thumbnailSrc}" class="player-thumbnail" alt="">
        
        <div class="top-controls">
          <div class="top-left-controls">${playerBrandHTML}${topSleepHTML}${topEnhancementsHTML}</div>
          <div class="top-right-controls">${topCcHTML}${topNetworkHTML}</div>
        </div>

        <div class="play-overlay">${playIcon}</div>
        <div class="player-toast-notification glass-panel"></div>
        <video class="content-video" style="display:none;" crossOrigin="anonymous" playsinline>${subtitleTracksHTML}</video>
        <div class="annotations-container"></div>
        <div class="loader-overlay glass-panel">
          <div class="loader-triangle"></div>
        </div>
        <div class="playback-pulse glass-panel"></div>
        <div class="gesture-indicator left">${backwardIcon}<span>-10s</span></div>
        <div class="gesture-indicator right">${forwardIcon}<span>+10s</span></div>
        <div class="volume-indicator glass-panel"><div class="volume-level"></div></div>
        <div class="network-status-popup glass-panel" style="display: none;"><div class="icon">${warningIcon}</div><span>No Internet Connection</span></div>
        <div class="player-tooltip glass-panel"></div>
        <div class="fullscreen-title-overlay"></div>
        ${watermarkHTML}
        
        <div class="bottom-controls-wrapper">
          <div class="seek-bar-container">
            <div class="seek-bar-track">
              <div class="seek-bar-buffer"></div>
              <div class="seek-bar-progress"></div>
            </div>
            <input type="range" class="seek-bar" value="0" step="0.1">
            <div class="seek-preview glass-panel"><span class="seek-preview-time">0:00</span></div>
          </div>
          
          <div class="custom-controls">
            <button class="play-pause-btn glass-panel" data-tooltip="Play/Pause (k/Space)">${playIcon}${pauseIcon}</button>
            
            <div class="time-and-seek glass-panel">
              <span class="time-display">0:00</span>
              <span class="duration-divider">/</span>
              <span class="duration-display">0:00</span>
            </div>

            <div class="spacer"></div>

            <div class="audio-waveform-container" style="display: flex; align-items: center; justify-content: center; width: 60px; height: 32px; border-radius: 8px; margin-right: 4px;">
              <canvas class="audio-waveform-canvas" width="60" height="20" style="display: block; opacity: 0.7;"></canvas>
            </div>

            ${muteBtnHTML}
            ${settingsMenuHTML}
            ${pipBtnHTML}
            ${fullscreenBtnHTML}
          </div>
        </div>
      </div>
      ${textContentHTML}
        ${c.shortcuts ? `
        <div class="shortcuts-modal-overlay" style="display: none;">
          <div class="shortcuts-modal glass-panel">
            <button class="modal-close-btn shortcuts-close-btn">${closeIcon}</button>
            <h3>Keyboard shortcuts</h3>
            <div class="shortcuts-grid">
              <div class="shortcut-item"><span>Play/Pause</span><kbd>k</kbd> / <kbd>Space</kbd></div>
              <div class="shortcut-item"><span>Mute/Unmute</span><kbd>m</kbd></div>
              <div class="shortcut-item"><span>Toggle Fullscreen</span><kbd>f</kbd></div>
              <div class="shortcut-item"><span>Toggle Picture-in-Picture</span><kbd>p</kbd></div>
              <div class="shortcut-item"><span>Toggle Subtitles</span><kbd>c</kbd></div>
              <div class="shortcut-item"><span>Toggle Network Stats</span><kbd>s</kbd></div>
              <div class="shortcut-item"><span>Open Settings</span><kbd>,</kbd></div>
              <div class="shortcut-item"><span>Seek back 10s</span><kbd>j</kbd> / <kbd>←</kbd></div>
              <div class="shortcut-item"><span>Seek forward 10s</span><kbd>l</kbd> / <kbd>→</kbd></div>
              <div class="shortcut-item"><span>Volume up</span><kbd>↑</kbd></div>
              <div class="shortcut-item"><span>Volume down</span><kbd>↓</kbd></div>
              <div class="shortcut-item"><span>Seek to 10%-90%</span><kbd>1</kbd>-<kbd>9</kbd></div>
              <div class="shortcut-item"><span>Seek to start</span><kbd>0</kbd></div>
              <div class="shortcut-item"><span>Show this dialog</span><kbd>?</kbd></div>
            </div>
          </div>
        </div>` : ''}
        
        <div class="custom-context-menu glass-panel" style="display: none; position: absolute; z-index: 1000; min-width: 220px; padding: 16px; border-radius: 12px; background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.6);">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Upper Row -->
            <div class="context-menu-header" style="display: flex; align-items: center; gap: 12px;">
              <div class="player-logo" style="width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); overflow: hidden;">
                ${getLogoSVG(uniqueId)}
              </div>
              <div class="player-info" style="display: flex; flex-direction: column; justify-content: center;">
                <span class="player-name" style="font-weight: 600; font-size: 0.95rem; line-height: 1.2; color: #fff; letter-spacing: 0.2px;">FlexPlayer</span>
                <span class="player-version" style="font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top: 2px;">Version ${version || "4.0.2"}</span>
              </div>
            </div>

            <div style="height: 1px; background: rgba(255,255,255,0.1); border-radius: 1px;"></div>

            <!-- Lower Row -->
            <div class="context-menu-socials" style="display: flex; align-items: center; padding-left: 8px;">
              <a href="https://github.com/juniorsir" target="_blank" rel="noopener" class="social-link" style="position: relative; margin-left: -8px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 1; text-decoration: none; color: inherit; cursor: pointer;" onmouseover="this.style.zIndex=10; this.style.transform='scale(1.2)'" onmouseout="this.style.zIndex=1; this.style.transform='scale(1)'">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #24292e; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                  <span class="icon" style="display: flex; width: 16px; height: 16px; color: #fff;">${githubIcon}</span>
                </div>
              </a>
              <a href="https://x.com/_Pradeep_bairwa" target="_blank" rel="noopener" class="social-link" style="position: relative; margin-left: -8px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 2; text-decoration: none; color: inherit; cursor: pointer;" onmouseover="this.style.zIndex=10; this.style.transform='scale(1.2)'" onmouseout="this.style.zIndex=2; this.style.transform='scale(1)'">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #1DA1F2; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                  <span class="icon" style="display: flex; width: 16px; height: 16px; color: #fff;">${twitterIcon}</span>
                </div>
              </a>
              <a href="https://instagram.com/_junior_sir_" target="_blank" rel="noopener" class="social-link" style="position: relative; margin-left: -8px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 3; text-decoration: none; color: inherit; cursor: pointer;" onmouseover="this.style.zIndex=10; this.style.transform='scale(1.2)'" onmouseout="this.style.zIndex=3; this.style.transform='scale(1)'">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                  <span style="display: flex; width: 16px; height: 16px; color: #fff;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></span>
                </div>
              </a>
              <a href="/" target="_blank" rel="noopener" class="social-link" style="position: relative; margin-left: -8px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 4; text-decoration: none; color: inherit; cursor: pointer;" onmouseover="this.style.zIndex=10; this.style.transform='scale(1.2)'" onmouseout="this.style.zIndex=4; this.style.transform='scale(1)'">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #0A66C2; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                  <span class="icon" style="display: flex; width: 16px; height: 16px; color: #fff;">${websiteIcon}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
    </div>
  `;
}

module.exports = { getHtml };
