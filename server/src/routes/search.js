import express from 'express';
import { dbHelper } from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/search?q=query&type=all|tracks|artists|albums|playlists
 * Spotify-grade Multi-entity search with top hit resolution
 */
router.get('/', optionalAuth, (req, res) => {
  try {
    const { q, type = 'all', limit = 20 } = req.query;

    if (!q || !q.trim()) {
      return res.json({
        success: true,
        query: '',
        topResult: null,
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      });
    }

    const term = `%${q.trim().toLowerCase()}%`;
    const numLimit = Math.min(Number(limit) || 20, 50);

    let likedSet = new Set();
    if (req.user) {
      const liked = dbHelper.all('SELECT track_id FROM liked_songs WHERE user_id = ?', req.user.id);
      likedSet = new Set(liked.map(l => l.track_id));
    }

    let tracks = [];
    let artists = [];
    let albums = [];
    let playlists = [];

    // Search Tracks
    if (type === 'all' || type.includes('tracks')) {
      tracks = dbHelper.all(`
        SELECT * FROM tracks
        WHERE LOWER(title) LIKE ? OR LOWER(artist_name) LIKE ? OR LOWER(genre) LIKE ?
        ORDER BY play_count DESC
        LIMIT ?
      `, term, term, term, numLimit).map(t => ({
        ...t,
        isLiked: likedSet.has(t.id),
        streamUrl: `/api/tracks/${t.id}/stream`
      }));
    }

    // Search Artists
    if (type === 'all' || type.includes('artists')) {
      artists = dbHelper.all(`
        SELECT * FROM artists
        WHERE LOWER(name) LIKE ? OR LOWER(genre) LIKE ?
        ORDER BY monthly_listeners DESC
        LIMIT ?
      `, term, term, numLimit);
    }

    // Search Albums
    if (type === 'all' || type.includes('albums')) {
      albums = dbHelper.all(`
        SELECT a.*, ar.name as artist_name
        FROM albums a
        JOIN artists ar ON ar.id = a.artist_id
        WHERE LOWER(a.title) LIKE ? OR LOWER(ar.name) LIKE ? OR LOWER(a.genre) LIKE ?
        ORDER BY a.release_year DESC
        LIMIT ?
      `, term, term, term, numLimit);
    }

    // Search Playlists
    if (type === 'all' || type.includes('playlists')) {
      playlists = dbHelper.all(`
        SELECT p.*, u.display_name as author_name,
               (SELECT COUNT(*) FROM playlist_tracks pt WHERE pt.playlist_id = p.id) as tracks_count
        FROM playlists p
        JOIN users u ON u.id = p.user_id
        WHERE p.is_public = 1 AND (LOWER(p.title) LIKE ? OR LOWER(p.description) LIKE ?)
        ORDER BY p.is_editorial DESC, p.created_at DESC
        LIMIT ?
      `, term, term, numLimit);
    }

    // Determine Top Result (best match among tracks or artists)
    let topResult = null;
    const cleanQ = q.trim().toLowerCase();
    
    // Check exact artist match
    const exactArtist = artists.find(a => a.name.toLowerCase() === cleanQ);
    if (exactArtist) {
      topResult = { type: 'artist', data: exactArtist };
    } else {
      // Check exact track match
      const exactTrack = tracks.find(t => t.title.toLowerCase() === cleanQ);
      if (exactTrack) {
        topResult = { type: 'track', data: exactTrack };
      } else if (artists.length > 0 && artists[0].monthly_listeners > 1000000) {
        topResult = { type: 'artist', data: artists[0] };
      } else if (tracks.length > 0) {
        topResult = { type: 'track', data: tracks[0] };
      } else if (albums.length > 0) {
        topResult = { type: 'album', data: albums[0] };
      }
    }

    res.json({
      success: true,
      query: q,
      topResult,
      tracks,
      artists,
      albums,
      playlists
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: true, message: 'Search query execution failed.' });
  }
});

export default router;
