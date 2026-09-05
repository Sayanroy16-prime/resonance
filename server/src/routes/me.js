import express from 'express';
import { dbHelper } from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Support authenticated users and default demo/guest listeners
router.use(optionalAuth);

/**
 * GET /api/me/liked-songs
 * Returns full track objects for all liked songs
 */
router.get('/liked-songs', (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const tracks = dbHelper.all(`
      SELECT t.*, ls.liked_at
      FROM liked_songs ls
      JOIN tracks t ON t.id = ls.track_id
      WHERE ls.user_id = ?
      ORDER BY ls.liked_at DESC
    `, userId);

    res.json({
      success: true,
      count: tracks.length,
      tracks: tracks.map(t => ({
        ...t,
        isLiked: true,
        streamUrl: `/api/tracks/${t.id}/stream`
      }))
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch liked songs.' });
  }
});

/**
 * GET /api/me/liked-ids
 * Lightweight endpoint returning array of liked track IDs
 */
router.get('/liked-ids', (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const rows = dbHelper.all('SELECT track_id FROM liked_songs WHERE user_id = ?', userId);
    res.json({
      success: true,
      likedTrackIds: rows.map(r => r.track_id)
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch liked track IDs.' });
  }
});

/**
 * POST /api/me/liked-songs/:trackId
 * Like track
 */
router.post('/liked-songs/:trackId', (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const { trackId } = req.params;
    const track = dbHelper.get('SELECT id FROM tracks WHERE id = ?', trackId);
    if (!track) {
      return res.status(404).json({ error: true, message: 'Track not found.' });
    }

    dbHelper.run(`
      INSERT OR IGNORE INTO liked_songs (user_id, track_id)
      VALUES (?, ?)
    `, userId, trackId);

    res.json({ success: true, isLiked: true, trackId, message: 'Track saved to Liked Songs.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to like track.' });
  }
});

/**
 * DELETE /api/me/liked-songs/:trackId
 * Remove track from liked songs
 */
router.delete('/liked-songs/:trackId', (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const { trackId } = req.params;
    dbHelper.run('DELETE FROM liked_songs WHERE user_id = ? AND track_id = ?', userId, trackId);
    res.json({ success: true, isLiked: false, trackId, message: 'Track removed from Liked Songs.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to remove liked track.' });
  }
});

/**
 * GET /api/me/playlists
 * User's created playlists
 */
router.get('/playlists', (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const playlists = dbHelper.all(`
      SELECT p.*,
             (SELECT COUNT(*) FROM playlist_tracks pt WHERE pt.playlist_id = p.id) as tracks_count
      FROM playlists p
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, userId);

    res.json({ success: true, count: playlists.length, playlists });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch user playlists.' });
  }
});

/**
 * GET /api/me/history
 * User listening history
 */
router.get('/history', (req, res) => {
  try {
    const history = dbHelper.all(`
      SELECT uh.id as history_id, uh.played_at, uh.duration_played, t.*
      FROM user_history uh
      JOIN tracks t ON t.id = uh.track_id
      WHERE uh.user_id = ?
      ORDER BY uh.played_at DESC
      LIMIT 50
    `, req.user.id);

    res.json({
      success: true,
      count: history.length,
      history: history.map(h => ({
        ...h,
        streamUrl: `/api/tracks/${h.id}/stream`
      }))
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch listening history.' });
  }
});

/**
 * DELETE /api/me/history
 */
router.delete('/history', (req, res) => {
  try {
    dbHelper.run('DELETE FROM user_history WHERE user_id = ?', req.user.id);
    res.json({ success: true, message: 'Listening history cleared.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to clear history.' });
  }
});

/**
 * GET /api/me/following
 */
router.get('/following', (req, res) => {
  try {
    const artists = dbHelper.all(`
      SELECT a.*, fa.followed_at
      FROM followed_artists fa
      JOIN artists a ON a.id = fa.artist_id
      WHERE fa.user_id = ?
      ORDER BY fa.followed_at DESC
    `, req.user.id);

    res.json({ success: true, count: artists.length, artists });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch followed artists.' });
  }
});

export default router;
