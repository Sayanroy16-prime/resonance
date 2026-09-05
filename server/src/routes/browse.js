import express from 'express';
import { dbHelper } from '../db/database.js';

const router = express.Router();

const CATEGORIES = [
  { id: 'techno', name: 'Industrial Techno', color: 'from-emerald-600 to-black', bg: '#00E676', icon: 'zap' },
  { id: 'synthwave', name: 'Synthwave', color: 'from-pink-600 to-purple-900', bg: '#EC4899', icon: 'radio' },
  { id: 'lofi', name: 'Lofi Beats', color: 'from-amber-600 to-orange-900', bg: '#F59E0B', icon: 'coffee' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: 'from-cyan-500 to-blue-900', bg: '#06B6D4', icon: 'cpu' },
  { id: 'electronic', name: 'Electronic', color: 'from-emerald-500 to-teal-900', bg: '#10B981', icon: 'activity' },
  { id: 'ambient', name: 'Ambient', color: 'from-indigo-600 to-violet-950', bg: '#6366F1', icon: 'cloud' }
];

/**
 * GET /api/browse/categories
 */
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    categories: CATEGORIES
  });
});

/**
 * GET /api/browse/featured
 */
router.get('/featured', (req, res) => {
  try {
    const heroTrack = dbHelper.get('SELECT * FROM tracks WHERE id = ?', 'track-1');
    const editorialPlaylists = dbHelper.all(`
      SELECT p.*, u.display_name as author_name,
             (SELECT COUNT(*) FROM playlist_tracks pt WHERE pt.playlist_id = p.id) as tracks_count
      FROM playlists p
      JOIN users u ON u.id = p.user_id
      WHERE p.is_editorial = 1
      LIMIT 6
    `);
    const trendingTracks = dbHelper.all('SELECT * FROM tracks ORDER BY play_count DESC LIMIT 6');
    const newReleases = dbHelper.all('SELECT * FROM albums ORDER BY release_year DESC LIMIT 4');

    res.json({
      success: true,
      featured: {
        heroTrack: { ...heroTrack, streamUrl: `/api/tracks/${heroTrack.id}/stream` },
        editorialPlaylists,
        trendingTracks: trendingTracks.map(t => ({ ...t, streamUrl: `/api/tracks/${t.id}/stream` })),
        newReleases
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch featured browse data.' });
  }
});

export default router;
