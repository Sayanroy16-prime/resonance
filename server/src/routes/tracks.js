import express from 'express';
import { dbHelper } from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';
import { streamAudioFromUrl } from '../services/streamService.js';
import { getPersonalizedRecommendations, getTrendingTracks } from '../services/recommendationService.js';

const router = express.Router();

/**
 * GET /api/tracks
 * Supports filtering by genre, artist, album, search query, limit, offset
 */
router.get('/', optionalAuth, (req, res) => {
  try {
    const { genre, artist_id, album_id, search, limit = 50, offset = 0 } = req.query;
    let sql = 'SELECT * FROM tracks WHERE 1=1';
    const params = [];

    if (genre) {
      sql += ' AND LOWER(genre) = LOWER(?)';
      params.push(genre);
    }
    if (artist_id) {
      sql += ' AND artist_id = ?';
      params.push(artist_id);
    }
    if (album_id) {
      sql += ' AND album_id = ?';
      params.push(album_id);
    }
    if (search) {
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(artist_name) LIKE ? OR LOWER(genre) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY play_count DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const tracks = dbHelper.all(sql, ...params);

    // If user is authenticated, check liked status
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
      count: tracksWithState.length,
      tracks: tracksWithState
    });
  } catch (err) {
    console.error('Fetch tracks error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve tracks catalog.' });
  }
});

/**
 * GET /api/tracks/trending
 */
router.get('/trending', optionalAuth, (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const tracks = getTrendingTracks(limit);
    
    let likedSet = new Set();
    if (req.user) {
      const liked = dbHelper.all('SELECT track_id FROM liked_songs WHERE user_id = ?', req.user.id);
      likedSet = new Set(liked.map(l => l.track_id));
    }

    res.json({
      success: true,
      tracks: tracks.map(t => ({ ...t, isLiked: likedSet.has(t.id), streamUrl: `/api/tracks/${t.id}/stream` }))
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch trending tracks.' });
  }
});

/**
 * GET /api/tracks/recommended
 */
router.get('/recommended', optionalAuth, (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const tracks = getPersonalizedRecommendations(req.user?.id, limit);

    let likedSet = new Set();
    if (req.user) {
      const liked = dbHelper.all('SELECT track_id FROM liked_songs WHERE user_id = ?', req.user.id);
      likedSet = new Set(liked.map(l => l.track_id));
    }

    res.json({
      success: true,
      tracks: tracks.map(t => ({ ...t, isLiked: likedSet.has(t.id), streamUrl: `/api/tracks/${t.id}/stream` }))
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch recommendations.' });
  }
});

/**
 * GET /api/tracks/:id
 */
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const track = dbHelper.get('SELECT * FROM tracks WHERE id = ?', req.params.id);
    if (!track) {
      return res.status(404).json({ error: true, message: 'Track not found.' });
    }

    let isLiked = false;
    if (req.user) {
      const liked = dbHelper.get('SELECT 1 FROM liked_songs WHERE user_id = ? AND track_id = ?', req.user.id, track.id);
      isLiked = !!liked;
    }

    const artist = dbHelper.get('SELECT id, name, image_url, monthly_listeners FROM artists WHERE id = ?', track.artist_id);
    const album = track.album_id ? dbHelper.get('SELECT id, title, cover_url, release_year FROM albums WHERE id = ?', track.album_id) : null;

    res.json({
      success: true,
      track: {
        ...track,
        isLiked,
        artist,
        album,
        streamUrl: `/api/tracks/${track.id}/stream`
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch track details.' });
  }
});

/**
 * GET /api/tracks/:id/stream
 * Spotify-grade Audio Stream with HTTP 206 Range Request Support
 */
router.get('/:id/stream', (req, res) => {
  try {
    const track = dbHelper.get('SELECT audio_url FROM tracks WHERE id = ?', req.params.id);
    if (!track || !track.audio_url) {
      return res.status(404).json({ error: true, message: 'Audio stream not found for this track.' });
    }

    streamAudioFromUrl(track.audio_url, req, res);
  } catch (err) {
    console.error('Audio stream error:', err);
    res.status(500).json({ error: true, message: 'Audio stream streaming error.' });
  }
});

/**
 * POST /api/tracks/:id/play
 * Scrobble / record play count & history
 */
router.post('/:id/play', optionalAuth, (req, res) => {
  try {
    const trackId = req.params.id;
    const { durationPlayed = 0 } = req.body;

    // Increment play count
    dbHelper.run('UPDATE tracks SET play_count = play_count + 1 WHERE id = ?', trackId);

    // If logged in, record in user_history
    if (req.user) {
      dbHelper.run(`
        INSERT INTO user_history (user_id, track_id, duration_played)
        VALUES (?, ?, ?)
      `, req.user.id, trackId, Number(durationPlayed));
    }

    const updated = dbHelper.get('SELECT id, title, play_count FROM tracks WHERE id = ?', trackId);
    res.json({ success: true, track: updated });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to scrobble track play.' });
  }
});

/**
 * POST /api/tracks
 * Ingest a single track into the dataset
 */
router.post('/', (req, res) => {
  try {
    const {
      title,
      artist,
      artist_name,
      album,
      album_title,
      duration = 210,
      audio_url,
      cover_url,
      genre = 'Electronic',
      release_year = new Date().getFullYear(),
      lyrics = '',
      is_explicit = 0
    } = req.body;

    if (!title || (!artist && !artist_name)) {
      return res.status(400).json({ error: true, message: 'Track title and artist are required.' });
    }

    const effectiveArtist = artist_name || artist;
    const effectiveAlbum = album_title || album || null;
    const trackId = `track-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const artistId = `artist-${effectiveArtist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    // Ensure artist exists
    const existingArtist = dbHelper.get('SELECT id FROM artists WHERE id = ?', artistId);
    if (!existingArtist) {
      dbHelper.run(`
        INSERT INTO artists (id, name, bio, image_url, verified, genre)
        VALUES (?, ?, ?, ?, 1, ?)
      `, artistId, effectiveArtist, `Featured artist: ${effectiveArtist}`, cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', genre);
    }

    dbHelper.run(`
      INSERT INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
      VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `, trackId, title, artistId, effectiveArtist, effectiveAlbum, Number(duration), audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', genre, Number(release_year), is_explicit ? 1 : 0, lyrics);

    const inserted = dbHelper.get('SELECT * FROM tracks WHERE id = ?', trackId);

    res.status(201).json({
      success: true,
      message: 'Track ingested successfully into dataset.',
      track: inserted
    });
  } catch (err) {
    console.error('Track ingest error:', err);
    res.status(500).json({ error: true, message: 'Failed to ingest track.' });
  }
});

/**
 * POST /api/tracks/batch
 * Ingest multiple tracks into the dataset at once
 */
router.post('/batch', (req, res) => {
  try {
    const { songs = [] } = req.body;
    if (!Array.isArray(songs) || songs.length === 0) {
      return res.status(400).json({ error: true, message: 'Expected an array of songs.' });
    }

    const insertedTracks = [];

    for (const song of songs) {
      const title = song.title || song.name;
      const artist = song.artist || song.artist_name || 'Unknown Artist';
      const genre = song.genre || 'Electronic';
      const duration = song.duration || 210;
      const audioUrl = song.audio_url || song.audioUrl || song.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      const coverUrl = song.cover_url || song.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
      const albumTitle = song.album || song.album_title || null;
      const releaseYear = song.release_year || song.year || 2026;
      const lyrics = song.lyrics || '';

      if (!title) continue;

      const trackId = `track-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const artistId = `artist-${artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

      // Check artist
      const existingArtist = dbHelper.get('SELECT id FROM artists WHERE id = ?', artistId);
      if (!existingArtist) {
        dbHelper.run(`
          INSERT INTO artists (id, name, bio, image_url, verified, genre)
          VALUES (?, ?, ?, ?, 1, ?)
        `, artistId, artist, `Artist: ${artist}`, coverUrl, genre);
      }

      dbHelper.run(`
        INSERT INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
        VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 0, 0, ?)
      `, trackId, title, artistId, artist, albumTitle, Number(duration), audioUrl, coverUrl, genre, Number(releaseYear), lyrics);

      insertedTracks.push({
        id: trackId,
        title,
        artist,
        genre,
        duration
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully ingested ${insertedTracks.length} tracks into dataset.`,
      count: insertedTracks.length,
      tracks: insertedTracks
    });
  } catch (err) {
    console.error('Batch ingest error:', err);
    res.status(500).json({ error: true, message: 'Failed to batch ingest tracks.' });
  }
});

export default router;
