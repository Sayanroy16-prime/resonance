import express from 'express';
import { dbHelper } from '../db/database.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateUser);

/**
 * GET /api/player
 * Fetch current cloud player session
 */
router.get('/', (req, res) => {
  try {
    let session = dbHelper.get('SELECT * FROM player_sessions WHERE user_id = ?', req.user.id);
    
    if (!session) {
      // Default session
      session = {
        user_id: req.user.id,
        current_track_id: 'track-1',
        is_playing: 0,
        progress_ms: 0,
        volume: 0.8,
        repeat_mode: 'off',
        is_shuffle: 0,
        queue_json: JSON.stringify(['track-2', 'track-3', 'track-4'])
      };
      dbHelper.run(`
        INSERT INTO player_sessions (user_id, current_track_id, is_playing, progress_ms, volume, repeat_mode, is_shuffle, queue_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, session.user_id, session.current_track_id, session.is_playing, session.progress_ms, session.volume, session.repeat_mode, session.is_shuffle, session.queue_json);
    }

    const currentTrack = session.current_track_id ? dbHelper.get('SELECT * FROM tracks WHERE id = ?', session.current_track_id) : null;
    let queueIds = [];
    try {
      queueIds = JSON.parse(session.queue_json || '[]');
    } catch {
      queueIds = [];
    }

    const queueTracks = queueIds.length > 0
      ? dbHelper.all(`SELECT * FROM tracks WHERE id IN (${queueIds.map(() => '?').join(',')})`, ...queueIds)
      : [];

    res.json({
      success: true,
      player: {
        ...session,
        is_playing: Boolean(session.is_playing),
        is_shuffle: Boolean(session.is_shuffle),
        currentTrack: currentTrack ? { ...currentTrack, streamUrl: `/api/tracks/${currentTrack.id}/stream` } : null,
        queue: queueTracks.map(t => ({ ...t, streamUrl: `/api/tracks/${t.id}/stream` }))
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to retrieve player state.' });
  }
});

/**
 * PUT /api/player
 * Update playback state
 */
router.put('/', (req, res) => {
  try {
    const { currentTrackId, isPlaying, progressMs, volume, repeatMode, isShuffle, queue } = req.body;

    const queueJson = queue ? JSON.stringify(queue.map(t => typeof t === 'string' ? t : t.id)) : null;

    dbHelper.run(`
      INSERT INTO player_sessions (user_id, current_track_id, is_playing, progress_ms, volume, repeat_mode, is_shuffle, queue_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        current_track_id = COALESCE(?, current_track_id),
        is_playing = COALESCE(?, is_playing),
        progress_ms = COALESCE(?, progress_ms),
        volume = COALESCE(?, volume),
        repeat_mode = COALESCE(?, repeat_mode),
        is_shuffle = COALESCE(?, is_shuffle),
        queue_json = COALESCE(?, queue_json),
        updated_at = CURRENT_TIMESTAMP
    `, 
      req.user.id, currentTrackId, isPlaying ? 1 : 0, progressMs, volume, repeatMode, isShuffle ? 1 : 0, queueJson,
      currentTrackId, isPlaying !== undefined ? (isPlaying ? 1 : 0) : null, progressMs, volume, repeatMode, isShuffle !== undefined ? (isShuffle ? 1 : 0) : null, queueJson
    );

    res.json({ success: true, message: 'Player state synced.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to sync player state.' });
  }
});

/**
 * POST /api/player/queue
 * Append track to player queue
 */
router.post('/queue', (req, res) => {
  try {
    const { trackId } = req.body;
    if (!trackId) {
      return res.status(400).json({ error: true, message: 'trackId is required.' });
    }

    const session = dbHelper.get('SELECT queue_json FROM player_sessions WHERE user_id = ?', req.user.id);
    let queue = [];
    if (session && session.queue_json) {
      try {
        queue = JSON.parse(session.queue_json);
      } catch {
        queue = [];
      }
    }

    queue.push(trackId);
    dbHelper.run('UPDATE player_sessions SET queue_json = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', JSON.stringify(queue), req.user.id);

    res.json({ success: true, queueCount: queue.length, message: 'Track queued.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to add to queue.' });
  }
});

export default router;
