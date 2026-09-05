import express from 'express';
import { dbHelper, db } from '../db/database.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/playlists
 * Editorial and public playlists
 */
router.get('/', (req, res) => {
  try {
    const playlists = dbHelper.all(`
      SELECT p.*, u.display_name as author_name,
             (SELECT COUNT(*) FROM playlist_tracks pt WHERE pt.playlist_id = p.id) as tracks_count
      FROM playlists p
      JOIN users u ON u.id = p.user_id
      WHERE p.is_public = 1
      ORDER BY p.is_editorial DESC, p.created_at DESC
    `);
    res.json({ success: true, count: playlists.length, playlists });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch playlists.' });
  }
});

/**
 * POST /api/playlists
 * Create custom playlist
 */
router.post('/', authenticateUser, (req, res) => {
  try {
    const { title, description, coverUrl, isPublic = true } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: true, message: 'Playlist title is required.' });
    }

    const id = `pl-${Date.now()}`;
    const cover = coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

    dbHelper.run(`
      INSERT INTO playlists (id, user_id, title, description, cover_url, is_public, is_editorial)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `, id, req.user.id, title.trim(), description || '', cover, isPublic ? 1 : 0);

    const created = dbHelper.get('SELECT * FROM playlists WHERE id = ?', id);
    res.status(201).json({ success: true, playlist: created });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to create playlist.' });
  }
});

/**
 * GET /api/playlists/:id
 */
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const playlist = dbHelper.get(`
      SELECT p.*, u.display_name as author_name, u.avatar_url as author_avatar
      FROM playlists p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `, req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: true, message: 'Playlist not found.' });
    }

    const tracks = dbHelper.all(`
      SELECT t.*, pt.position, pt.added_at
      FROM playlist_tracks pt
      JOIN tracks t ON t.id = pt.track_id
      WHERE pt.playlist_id = ?
      ORDER BY pt.position ASC
    `, playlist.id);

    let likedSet = new Set();
    if (req.user) {
      const liked = dbHelper.all('SELECT track_id FROM liked_songs WHERE user_id = ?', req.user.id);
      likedSet = new Set(liked.map(l => l.track_id));
    }

    const tracksWithState = tracks.map(t => ({
      ...t,
      isLiked: likedSet.has(t.id),
      streamUrl: `/api/tracks/${t.id}/stream`
    }));

    const isOwner = req.user ? req.user.id === playlist.user_id : false;

    res.json({
      success: true,
      playlist: {
        ...playlist,
        isOwner,
        tracks: tracksWithState,
        tracksCount: tracksWithState.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch playlist.' });
  }
});

/**
 * PUT /api/playlists/:id
 */
router.put('/:id', authenticateUser, (req, res) => {
  try {
    const playlist = dbHelper.get('SELECT * FROM playlists WHERE id = ?', req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: true, message: 'Playlist not found.' });
    }

    if (playlist.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Not authorized to edit this playlist.' });
    }

    const { title, description, coverUrl, isPublic } = req.body;

    dbHelper.run(`
      UPDATE playlists
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          cover_url = COALESCE(?, cover_url),
          is_public = COALESCE(?, is_public),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, title, description, coverUrl, isPublic !== undefined ? (isPublic ? 1 : 0) : null, playlist.id);

    const updated = dbHelper.get('SELECT * FROM playlists WHERE id = ?', playlist.id);
    res.json({ success: true, playlist: updated });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to update playlist.' });
  }
});

/**
 * DELETE /api/playlists/:id
 */
router.delete('/:id', authenticateUser, (req, res) => {
  try {
    const playlist = dbHelper.get('SELECT * FROM playlists WHERE id = ?', req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: true, message: 'Playlist not found.' });
    }

    if (playlist.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Not authorized to delete this playlist.' });
    }

    dbHelper.run('DELETE FROM playlists WHERE id = ?', playlist.id);
    res.json({ success: true, message: 'Playlist deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to delete playlist.' });
  }
});

/**
 * POST /api/playlists/:id/tracks
 * Add track to playlist
 */
router.post('/:id/tracks', authenticateUser, (req, res) => {
  try {
    const { trackId } = req.body;
    if (!trackId) {
      return res.status(400).json({ error: true, message: 'trackId is required.' });
    }

    const playlist = dbHelper.get('SELECT * FROM playlists WHERE id = ?', req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: true, message: 'Playlist not found.' });
    }

    if (playlist.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Not authorized to add tracks to this playlist.' });
    }

    // Determine position
    const maxPos = dbHelper.get('SELECT MAX(position) as max_pos FROM playlist_tracks WHERE playlist_id = ?', playlist.id)?.max_pos || 0;

    dbHelper.run(`
      INSERT OR REPLACE INTO playlist_tracks (playlist_id, track_id, position)
      VALUES (?, ?, ?)
    `, playlist.id, trackId, maxPos + 1);

    res.json({ success: true, message: 'Track added to playlist.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to add track to playlist.' });
  }
});

/**
 * DELETE /api/playlists/:id/tracks/:trackId
 * Remove track from playlist
 */
router.delete('/:id/tracks/:trackId', authenticateUser, (req, res) => {
  try {
    const { id, trackId } = req.params;
    const playlist = dbHelper.get('SELECT * FROM playlists WHERE id = ?', id);
    if (!playlist) {
      return res.status(404).json({ error: true, message: 'Playlist not found.' });
    }

    if (playlist.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'Not authorized to remove tracks from this playlist.' });
    }

    dbHelper.run('DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?', id, trackId);
    res.json({ success: true, message: 'Track removed from playlist.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to remove track from playlist.' });
  }
});

export default router;
