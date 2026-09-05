import express from 'express';
import { dbHelper } from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/albums
 */
router.get('/', (req, res) => {
  try {
    const albums = dbHelper.all(`
      SELECT a.*, ar.name as artist_name 
      FROM albums a
      JOIN artists ar ON ar.id = a.artist_id
      ORDER BY a.release_year DESC
    `);
    res.json({ success: true, count: albums.length, albums });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch albums.' });
  }
});

/**
 * GET /api/albums/:id
 */
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const album = dbHelper.get(`
      SELECT a.*, ar.name as artist_name, ar.image_url as artist_image 
      FROM albums a
      JOIN artists ar ON ar.id = a.artist_id
      WHERE a.id = ?
    `, req.params.id);

    if (!album) {
      return res.status(404).json({ error: true, message: 'Album not found.' });
    }

    const tracks = dbHelper.all('SELECT * FROM tracks WHERE album_id = ? ORDER BY id ASC', album.id);

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

    res.json({
      success: true,
      album: {
        ...album,
        tracks: tracksWithState,
        tracksCount: tracksWithState.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch album details.' });
  }
});

export default router;
