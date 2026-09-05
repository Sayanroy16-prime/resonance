# 🎵 Resonance | Studio & Offline Music Streaming

Resonance is a next-generation music streaming and guitar audio workstation featuring a futuristic circular album orbit interface, high-fidelity 256kbps audio streaming with HTTP 206 byte-range support, offline IndexedDB caching, and a built-in virtual Guitar Studio with interactive chord sheets and tablature.

---

## ✨ Features

- **🌀 Circular Orbit Home Interface**:
  - Vinyl center turntable with spinning groove rings and speed controls (33 / 45 / 78 RPM).
  - Dynamic Liked Song Orbit: orbits only liked tracks around the central record.
  - Interactive orbital positioning with zoom-on-hover effects.

- **🎸 Virtual Guitar Studio**:
  - Interactive chord diagrams (`Am`, `Em`, `C`, `G`, `D`, `Dm`, `Bb`, `F`, `Bm`).
  - Capo positions, tuning standards, and complete tablature inspectors.
  - Play-along audio sync with 1-click clipboard tab copy.
  - Virtual stompbox pedalboard (Overdrive, Delay, Reverb, Chorus) with real-time parameter controls.
  - Precision reference pitch tuner for Standard E, Drop D, DADGAD, Open G.

- **🔊 Master Quality Audio Engine**:
  - Pristine 256kbps stereo AAC/M4A master audio.
  - Native Web Audio API waveform visualizer and frequency spectrum analyzer.
  - Zero-latency HTTP 206 partial content streaming (`Range: bytes=X-Y`).
  - Offline mode with full IndexedDB audio blob caching.

- **🌐 Spotify-Grade Node.js Backend**:
  - Native `node:sqlite` database with relational schema for tracks, albums, artists, guitar tabs, and liked songs.
  - Spotify Connect WebSocket Gateway (`/ws`) for cross-device synchronized playback state.
  - RESTful APIs with scrobbling, search, playlists, and audio streaming endpoints.

---

## 🎧 Song Catalog & Guitar Tabs

Includes complete audio and interactive tablatures for:
- **Aadat** — Atif Aslam / Jal
- **Toh Phir Aao** — Mustafa Zahid (Roxen)
- **Yeh Awarapan** — KK (*Jism*)
- **Naadan Parindey** — A.R. Rahman & Mohit Chauhan (*Rockstar*)
- **Bulleya** — Amit Mishra & Shilpa Rao (*Ae Dil Hai Mushkil*)
- **Main Phir Bhi Tumko Chahunga** — Arijit Singh & Shashaa Tirupati (*Half Girlfriend*)
- **Saiyaara** — Mohit Chauhan & Taraannum Mallik (*Ek Tha Tiger*)
- **Tera Mera Rishta** — Mustafa Zahid (*Awarapan*)
- **Cold** — Maroon 5 ft. Future (*Red Pill Blues*)
- **Feels** — Calvin Harris ft. Pharrell, Katy Perry & Big Sean
- **Counting Stars** — OneRepublic (*Native*)

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Server
```bash
node server/index.js
# Backend runs at http://localhost:5001
```

### 3. Start Frontend
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Web Audio API, IndexedDB
- **Backend**: Node.js, Express, `node:sqlite`, WebSocket (ws), HTTP 206 Streaming
- **Audio Encoding**: 256kbps AAC / M4A Master Stereo
