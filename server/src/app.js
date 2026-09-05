import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/auth.js';
import trackRoutes from './routes/tracks.js';
import albumRoutes from './routes/albums.js';
import artistRoutes from './routes/artists.js';
import playlistRoutes from './routes/playlists.js';
import meRoutes from './routes/me.js';
import searchRoutes from './routes/search.js';
import browseRoutes from './routes/browse.js';
import playerRoutes from './routes/player.js';
import guitarRoutes from './routes/guitar.js';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Range']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/audio', express.static(path.resolve('public/audio')));

  // Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'Resonance Spotify Backend',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime())
    });
  });

  // Spotify-grade Interactive API Documentation Landing Page
  app.get(['/', '/api'], (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Resonance Spotify Backend API</title>
        <style>
          body {
            background-color: #0d0d12;
            color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
          }
          .container {
            max-width: 900px;
            width: 100%;
          }
          .header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          .badge {
            background: #1DB954;
            color: #000;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          h1 { margin: 0; font-size: 28px; font-weight: 900; }
          p.lead { color: #9ca3af; margin: 6px 0 0 0; font-size: 14px; }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 16px;
            margin-top: 24px;
          }
          .card {
            background: #16161f;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 16px;
            padding: 20px;
          }
          .card h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #1DB954;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .endpoint {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
            background: rgba(0,0,0,0.4);
            padding: 6px 10px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .method {
            font-weight: bold;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .get { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
          .post { background: rgba(16, 185, 129, 0.2); color: #34d399; }
          .put { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
          .delete { background: rgba(239, 68, 68, 0.2); color: #f87171; }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 6px;">
                <span class="badge">ONLINE</span>
                <span style="color: #6b7280; font-size: 12px;">Port ${config.port}</span>
              </div>
              <h1>Resonance Spotify Backend</h1>
              <p class="lead">Production-ready music streaming REST API & Spotify Connect WebSocket gateway.</p>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <h3>Authentication</h3>
              <div class="endpoint"><span class="method post">POST</span> /api/auth/register</div>
              <div class="endpoint"><span class="method post">POST</span> /api/auth/login</div>
              <div class="endpoint"><span class="method post">POST</span> /api/auth/guest</div>
              <div class="endpoint"><span class="method post">POST</span> /api/auth/phone-otp/send</div>
              <div class="endpoint"><span class="method get">GET</span> /api/auth/me</div>
            </div>

            <div class="card">
              <h3>Tracks & Streaming</h3>
              <div class="endpoint"><span class="method get">GET</span> /api/tracks</div>
              <div class="endpoint"><span class="method get">GET</span> /api/tracks/:id</div>
              <div class="endpoint"><span class="method get">GET</span> /api/tracks/:id/stream (206)</div>
              <div class="endpoint"><span class="method get">GET</span> /api/tracks/trending</div>
              <div class="endpoint"><span class="method get">GET</span> /api/tracks/recommended</div>
              <div class="endpoint"><span class="method post">POST</span> /api/tracks/:id/play</div>
            </div>

            <div class="card">
              <h3>Playlists & Library</h3>
              <div class="endpoint"><span class="method get">GET</span> /api/playlists</div>
              <div class="endpoint"><span class="method post">POST</span> /api/playlists</div>
              <div class="endpoint"><span class="method get">GET</span> /api/playlists/:id</div>
              <div class="endpoint"><span class="method post">POST</span> /api/playlists/:id/tracks</div>
              <div class="endpoint"><span class="method get">GET</span> /api/me/liked-songs</div>
              <div class="endpoint"><span class="method post">POST</span> /api/me/liked-songs/:trackId</div>
            </div>

            <div class="card">
              <h3>Search & Discovery</h3>
              <div class="endpoint"><span class="method get">GET</span> /api/search?q=...</div>
              <div class="endpoint"><span class="method get">GET</span> /api/browse/categories</div>
              <div class="endpoint"><span class="method get">GET</span> /api/browse/featured</div>
              <div class="endpoint"><span class="method get">GET</span> /api/albums/:id</div>
              <div class="endpoint"><span class="method get">GET</span> /api/artists/:id</div>
            </div>

            <div class="card">
              <h3>Guitar Studio</h3>
              <div class="endpoint"><span class="method get">GET</span> /api/guitar/tracks</div>
              <div class="endpoint"><span class="method get">GET</span> /api/guitar/categories</div>
              <div class="endpoint"><span class="method get">GET</span> /api/guitar/tunings</div>
              <div class="endpoint"><span class="method get">GET</span> /api/guitar/chords</div>
              <div class="endpoint"><span class="method get">GET</span> /api/guitar/pedals</div>
              <div class="endpoint"><span class="method get">GET</span> /api/guitar/presets</div>
              <div class="endpoint"><span class="method post">POST</span> /api/guitar/presets</div>
            </div>

            <div class="card">
              <h3>Spotify Connect</h3>
              <div class="endpoint"><span class="method get">GET</span> /api/player</div>
              <div class="endpoint"><span class="method put">PUT</span> /api/player</div>
              <div class="endpoint"><span class="method post">POST</span> /api/player/queue</div>
              <div class="endpoint"><span class="method get">WS</span> ws://localhost:${config.port}/ws</div>
            </div>

            <div class="card">
              <h3>System</h3>
              <div class="endpoint"><span class="method get">GET</span> /api/health</div>
              <div style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                Storage: <strong>SQLite (native node:sqlite)</strong><br/>
                Auth: <strong>JWT (HMAC-SHA256)</strong><br/>
                Audio Protocol: <strong>HTTP Range (206)</strong>
              </div>
            </div>
          </div>

          <div class="footer">
            Resonance Audio System &copy; 2026. Built with high fidelity.
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // Mount API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/tracks', trackRoutes);
  app.use('/api/albums', albumRoutes);
  app.use('/api/artists', artistRoutes);
  app.use('/api/playlists', playlistRoutes);
  app.use('/api/me', meRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/browse', browseRoutes);
  app.use('/api/player', playerRoutes);
  app.use('/api/guitar', guitarRoutes);

  // Catch 404s and Errors
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
