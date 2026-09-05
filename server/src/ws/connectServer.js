import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

/**
 * Spotify Connect WebSocket Server
 * Enables real-time synchronization between web players, mobile devices, and desktop clients
 */
export const initWebSocketServer = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Map: userId -> Set of active WebSocket client connections
  const userClients = new Map();

  wss.on('connection', (ws, req) => {
    let currentUserId = 'anonymous';

    // Parse token from query parameter: ?token=...
    try {
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      if (token) {
        const decoded = jwt.verify(token, config.jwtSecret);
        currentUserId = decoded.userId;
      }
    } catch {
      // Allow connection with fallback
    }

    if (!userClients.has(currentUserId)) {
      userClients.set(currentUserId, new Set());
    }
    userClients.get(currentUserId).add(ws);

    // Send connection greeting
    ws.send(JSON.stringify({
      type: 'CONNECT_READY',
      userId: currentUserId,
      activeDevices: userClients.get(currentUserId).size,
      timestamp: Date.now()
    }));

    // Handle messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'PLAYER_SYNC':
            // Broadcast playback state to all other connected devices for this user
            broadcastToUser(currentUserId, ws, {
              type: 'PLAYER_SYNC',
              sender: message.deviceId || 'device-web',
              state: message.state,
              timestamp: Date.now()
            });
            break;

          case 'QUEUE_SYNC':
            broadcastToUser(currentUserId, ws, {
              type: 'QUEUE_SYNC',
              queue: message.queue,
              timestamp: Date.now()
            });
            break;

          case 'PING':
            ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
            break;
        }
      } catch (err) {
        console.error('WS message error:', err);
      }
    });

    ws.on('close', () => {
      if (userClients.has(currentUserId)) {
        userClients.get(currentUserId).delete(ws);
        if (userClients.get(currentUserId).size === 0) {
          userClients.delete(currentUserId);
        }
      }
    });
  });

  const broadcastToUser = (userId, senderWs, payload) => {
    const clients = userClients.get(userId);
    if (!clients) return;

    const dataStr = JSON.stringify(payload);
    for (const client of clients) {
      if (client !== senderWs && client.readyState === 1) { // 1 = OPEN
        client.send(dataStr);
      }
    }
  };

  console.log('📡 Spotify Connect WebSocket Gateway initialized at /ws');
  return wss;
};
