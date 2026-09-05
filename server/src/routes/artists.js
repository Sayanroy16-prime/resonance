import express from 'express';
import { dbHelper } from '../db/database.js';
import { optionalAuth, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/artists
 */
router.get('/', (req, res) => {
  try {
    const artists = dbHelper.all('SELECT * FROM artists ORDER BY monthly_listeners DESC');
    res.json({ success: true, count: artists.length, artists });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch artists.' });
  }
});

/**
 * GET /api/artists/:id
 */
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const artist = dbHelper.get('SELECT * FROM artists WHERE id = ?', req.params.id);
    if (!artist) {
      return res.status(404).json({ error: true, message: 'Artist not found.' });
    }

    const topTracks = dbHelper.all('SELECT * FROM tracks WHERE artist_id = ? ORDER BY play_count DESC LIMIT 10', artist.id);
    const albums = dbHelper.all('SELECT * FROM albums WHERE artist_id = ? ORDER BY release_year DESC', artist.id);

    let isFollowing = false;
    let likedSet = new Set();
    if (req.user) {
      const followRecord = dbHelper.get('SELECT 1 FROM followed_artists WHERE user_id = ? AND artist_id = ?', req.user.id, artist.id);
      isFollowing = !!followRecord;

      const liked = dbHelper.all('SELECT track_id FROM liked_songs WHERE user_id = ?', req.user.id);
      likedSet = new Set(liked.map(l => l.track_id));
    }

    res.json({
      success: true,
      artist: {
        ...artist,
        isFollowing,
        topTracks: topTracks.map(t => ({ ...t, isLiked: likedSet.has(t.id), streamUrl: `/api/tracks/${t.id}/stream` })),
        albums
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch artist details.' });
  }
});

/**
 * POST /api/artists/:id/follow
 */
router.post('/:id/follow', authenticateUser, (req, res) => {
  try {
    const artistId = req.params.id;
    const exists = dbHelper.get('SELECT id FROM artists WHERE id = ?', artistId);
    if (!exists) {
      return res.status(404).json({ error: true, message: 'Artist not found.' });
    }

    dbHelper.run(`
      INSERT OR IGNORE INTO followed_artists (user_id, artist_id)
      VALUES (?, ?)
    `, req.user.id, artistId);

    res.json({ success: true, isFollowing: true, message: 'Artist followed.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to follow artist.' });
  }
});

/**
 * DELETE /api/artists/:id/follow
 */
router.delete('/:id/follow', authenticateUser, (req, res) => {
  try {
    const artistId = req.params.id;
    dbHelper.run('DELETE FROM followed_artists WHERE user_id = ? AND artist_id = ?', req.user.id, artistId);
    res.json({ success: true, isFollowing: false, message: 'Artist unfollowed.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to unfollow artist.' });
  }
});

export default router;
