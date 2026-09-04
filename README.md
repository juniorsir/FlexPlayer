# 🎥 FlexPlayer Studio

[![Version](https://img.shields.io/badge/version-4.0.2-blue.svg)](https://github.com/yourusername/flexplayer)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

FlexPlayer Studio is a highly customizable, production-grade, full-stack video player solution. Designed for high-performance HLS streaming, stunning visuals (ambient lighting, responsive layouts), and advanced developer controls, it allows you to generate embed codes and customize the player in real-time.

![FlexPlayer Studio Demo](https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop)

---

## ✨ Features

### 🎬 Advanced Playback
- **HLS Streaming**: Native integration with `hls.js` for `.m3u8` formats with seamless adaptive bitrate streaming.
- **Auto-Healing**: Intelligent buffer management and network stall recovery.
- **Quality Selection**: Automatic quality switching or manual selection (1080p, 720p, etc.).
- **Playback Speed**: Custom playback rates with visual indicators.
- **Picture-in-Picture (PiP)**: Native PiP support for floating video playback.

### 🎨 Premium UI & Design
- **Liquid Glass Interface**: Minimalist transparent controls with backdrop blurs.
- **Ambient Lighting mode**: Real-time glow effect surrounding the player (blur, saturation, and bleed controls).
- **Responsive Layout**: Adjusts seamlessly across mobile, tablet, and desktop. Cinematics 1-column or 2-column details.
- **Fluid Typography**: Scales dynamically based on screen real estate.
- **Custom Branding**: Add watermarks with dynamic positioning, opacity, click-through URLs, and rounded corners.

### 🛠️ Developer & Editor Tools
- **FlexPlayer Studio UI**: A visual editor to configure the player and instantly generate embed codes.
- **Export Options**: Export as HTML Embed, Android Kotlin (WebView), or Android XML Layout.
- **REST API**: Programmatically generate HTML/JS/CSS fragments via `POST /api/generate`.
- **Event Emitters**: Custom DOM events (`flex:controls-visibility`, `flex:error`) for analytics and tracking.
- **Serverless Ready**: Deploys seamlessly to Vercel, Node.js servers, or Docker containers.

---

## 🚀 Quick Start (Usage)

The easiest way to integrate FlexPlayer into your application is using the generated HTML embed. 

1. **Include the Player Script:**
```html
<script src="https://player-teal-seven.vercel.app/player.js" defer></script>
```

2. **Add the Embed `div`:**
```html
<div class="media-player-embed" data-config='{"videoSrc":"https://example.com/stream.m3u8", "title":"Epic Video"}'></div>
```

*Tip: Use the [FlexPlayer Studio UI](https://player-teal-seven.vercel.app/) to visually configure the player and generate the `data-config` base64 string or JSON automatically!*

### JS SDK (Programmatic Mount)

If you prefer to mount the player programmatically in frameworks like React, Vue, or Vanilla JS:

```javascript
window.FlexPlayer.mount(document.getElementById('my-player'), {
  videoSrc: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  title: 'Cinematic View',
  controls: {
    ambient: true,
    pip: true,
    fullscreen: true,
    subtitles: true
  },
  ambientConfig: { blur: 80, opacity: 0.8 }
});
```

---

## 🎛️ Player Controls Reference

FlexPlayer allows granular control over every aspect of the player UI. When configuring the `controls` object (in the API or via `data-config`), you can pass a boolean `true`/`false` for any of the following options to toggle specific buttons and features on or off.

### Base UI Controls
- **`brand`**: Displays the custom player brand logo/icon inside the control bar.
- **`pip` (Picture-in-Picture)**: Toggles the native PiP button allowing users to pop the video out into a floating window.
- **`fullscreen`**: Toggles the ability to enter and exit full-screen mode.
- **`mute`**: Toggles the volume icon, which handles muting, unmuting, and expanding the volume slider.
- **`settings`**: Toggles the gear icon, unlocking access to the detailed nested settings menu.

### Settings Menu Enhancements
*These options control features found inside the main settings gear menu.*
- **`speed`**: Allows users to adjust the video playback rate (0.25x up to 2.0x).
- **`quality`**: Enables manual resolution switching (if multiple streams are available in the HLS manifest).
- **`subtitles`**: Enables closed captions/subtitles (requires `.vtt` configurations).
- **`ambient`**: Adds the "Ambient Mode" toggle, casting a colorful synchronized glow around the player using the current video frames.
- **`sleep`**: Enables the Sleep Timer functionality, auto-pausing playback after a set amount of time.
- **`stableVolume`**: Adds the "Stable Volume" toggle, helping to normalize audio levels and reduce sudden spikes.
- **`network`**: Shows network statistics and buffer health in the settings menu.
- **`shortcuts`**: Displays a keyboard shortcuts reference in the settings menu.

### Video Enhancements
- **`hdr` (HDR Enhancement)**: Toggles a simulated HDR filter to artificially boost local contrast and highlight clipping for supported displays.
- **`colorEnhance`**: Adds a color-enhancement toggle, boosting vibrance and saturation for vivid content like gaming or anime.
- **`annotations`**: Allows timed UI popups, cards, or notes to appear over the player (configured via the `annotations` array).

### Overlays & Post-play
- **`watermark`**: Determines whether your persistent custom watermark overlay (top-left/right) is rendered on the player.
- **`loop`**: Automatically repeats the video indefinitely once it reaches the end.
- **`share`**: Toggles the built-in share menu, offering users quick export links for Twitter, Facebook, WhatsApp, LinkedIn, and Email.
- **`ads`**: Toggles the display of ad markers or pre-roll/mid-roll indicators.

**Example `controls` implementation:**
```json
{
  "controls": {
    "play": true,
    "volume": true,
    "fullscreen": true,
    "ambient": false,
    "sleep": true,
    "share": true,
    "loop": true,
    "network": false
  }
}
```

---

## ⚙️ Self-Hosting (Development)

Want to host the Studio and API yourself? It's easy to run locally or deploy.

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/flexplayer.git
   cd flexplayer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables (optional):**
   Copy `.env.example` to `.env` if you plan to use Upstash Redis for analytics/stats.
4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
5. **Open Studio:**
   Visit `http://localhost:3000` in your browser.

---

## 📖 Configuration API Reference

The `options` object passed to `FlexPlayer.mount()` or via `data-config` accepts the following properties:

### Core Configuration
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `videoSrc` | `string` | *(Required)* | URL to the video file (`.m3u8` or `.mp4`). |
| `thumbnailSrc` | `string` | `""` | URL to the poster image shown before playback. |
| `title` | `string` | `""` | Bold heading displayed inside the player layout. |
| `description` | `string` | `""` | Body text describing the video content. |
| `aspectRatio` | `string` | `"16 / 9"` | CSS aspect ratio of the player container. |
| `radius` | `number` | `12` | Border radius (px) of the player. |

### Advanced & Branding
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `watermark` | `object` | `null` | Configures the logo overlay. `{ imageUrl: '...', position: 'top-right', opacity: 0.7 }` |
| `ambientConfig` | `object` | `{...}` | Fine-tune the ambient glow. Keys: `blur`, `opacity`, `saturation`, `scale`, `bleed`. |
| `subtitles` | `array` | `[]` | Array of subtitle objects: `{ label, srclang, src, default }`. |

### Annotations & Credits
| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `annotations`| `array` | `[]` | Timed popups on the video. `{ start, end, text, url, position }`. |
| `writers` | `array` | `[]` | List of writers to show below the video. `{ name, url }`. |
| `directors` | `array` | `[]` | List of directors to show below the video. `{ name, url }`. |
| `stars` | `array` | `[]` | List of actors to show below the video. `{ name, url }`. |

---

## 🤖 Automation & Advanced Usage

### 1. Dynamic Updates
For single-page applications (React, Vue, Svelte) or dynamic dashboards, you can update an existing player instance without full re-mounting.

```javascript
// Updates the player matching this ID with new configuration
window.FlexPlayer.update('my-player-id', {
  title: 'New Video Title',
  videoSrc: 'https://cdn.example.com/stream-2.m3u8'
});
```

### 2. Bulk Script Injection
You can drop the `player.js` script onto any page with multiple `.media-player-embed` divs. The library uses a `MutationObserver` to automatically detect and initialize players added to the DOM at any point in the lifecycle.

### 3. API Automation (REST)

You can generate the complete HTML/CSS/JS payload for a player dynamically via the REST API. This is useful for server-side rendering (SSR) or email embeds.

**Endpoint:** `POST /api/generate`

**Payload:**
```json
{
  "videoSrc": "https://...",
  "title": "Automated Render",
  "radius": 16,
  "controls": {
    "ambient": true,
    "share": false
  }
}
```

**Response:** Returns a raw HTML string containing the fully scoped styles, SVG icons, and JS logic ready to be injected into the DOM.

---

## ⚡ Events & Telemetry

Automate your UI responses or connect 3rd-party tracking by subscribing to player lifecycle events on the container DOM element.

```javascript
const playerContainer = document.querySelector('.media-player-component');

// Fired when the control bar shows or hides (useful for dimming lights)
playerContainer.addEventListener('flex:controls-visibility', (e) => {
  console.log('Controls visible:', e.detail.visible);
});

// Fired on fatal playback errors
playerContainer.addEventListener('flex:error', (e) => {
  console.error('Playback failed:', e.detail.message);
});
```

---

## 🤝 Contributing

Contributions are welcome! Whether it's adding new features, fixing bugs, or improving documentation, feel free to open a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
