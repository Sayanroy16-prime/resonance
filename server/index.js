import http from 'node:http';
import { createApp } from './src/app.js';
import { config } from './src/config/index.js';
import { initWebSocketServer } from './src/ws/connectServer.js';

const app = createApp();
const server = http.createServer(app);

// Initialize Spotify Connect WebSocket Gateway
initWebSocketServer(server);

server.listen(config.port, () => {
  console.log(`
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   🎵 RESONANCE SPOTIFY BACKEND SERVICE ONLINE          │
│                                                         │
│   • HTTP API:    http://localhost:${config.port}/api             │
│   • Health:      http://localhost:${config.port}/api/health      │
│   • Connect WS:  ws://localhost:${config.port}/ws                │
│   • Database:    ${config.dbPath}
│                                                         │
└─────────────────────────────────────────────────────────┘
  `);
});
