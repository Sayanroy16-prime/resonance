import express from 'express';
import { dbHelper } from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Reference Tunings with exact string frequencies (Hz) for digital tuners
const GUITAR_TUNINGS = [
  {
    id: 'standard-e',
    name: 'Standard E',
    description: 'Universal standard guitar tuning (E-A-D-G-B-E)',
    strings: [
      { name: 'E4', note: 'E', octave: 4, freq: 329.63, stringNumber: 1 },
      { name: 'B3', note: 'B', octave: 3, freq: 246.94, stringNumber: 2 },
      { name: 'G3', note: 'G', octave: 3, freq: 196.00, stringNumber: 3 },
      { name: 'D3', note: 'D', octave: 3, freq: 146.83, stringNumber: 4 },
      { name: 'A2', note: 'A', octave: 2, freq: 110.00, stringNumber: 5 },
      { name: 'E2', note: 'E', octave: 2, freq: 82.41,  stringNumber: 6 }
    ]
  },
  {
    id: 'drop-d',
    name: 'Drop D',
    description: 'Heavy riffing and easy power chords (D-A-D-G-B-E)',
    strings: [
      { name: 'E4', note: 'E', octave: 4, freq: 329.63, stringNumber: 1 },
      { name: 'B3', note: 'B', octave: 3, freq: 246.94, stringNumber: 2 },
      { name: 'G3', note: 'G', octave: 3, freq: 196.00, stringNumber: 3 },
      { name: 'D3', note: 'D', octave: 3, freq: 146.83, stringNumber: 4 },
      { name: 'A2', note: 'A', octave: 2, freq: 110.00, stringNumber: 5 },
      { name: 'D2', note: 'D', octave: 2, freq: 73.42,  stringNumber: 6 }
    ]
  },
  {
    id: 'dadgad',
    name: 'DADGAD (Celtic / Ambient)',
    description: 'Lush droning modal resonance favored by folk, ambient, and acoustic masters',
    strings: [
      { name: 'D4', note: 'D', octave: 4, freq: 293.66, stringNumber: 1 },
      { name: 'A3', note: 'A', octave: 3, freq: 220.00, stringNumber: 2 },
      { name: 'G3', note: 'G', octave: 3, freq: 196.00, stringNumber: 3 },
      { name: 'D3', note: 'D', octave: 3, freq: 146.83, stringNumber: 4 },
      { name: 'A2', note: 'A', octave: 2, freq: 110.00, stringNumber: 5 },
      { name: 'D2', note: 'D', octave: 2, freq: 73.42,  stringNumber: 6 }
    ]
  },
  {
    id: 'open-g',
    name: 'Open G (Delta Blues)',
    description: 'Classic slide blues & Keith Richards open chord voicing (D-G-D-G-B-D)',
    strings: [
      { name: 'D4', note: 'D', octave: 4, freq: 293.66, stringNumber: 1 },
      { name: 'B3', note: 'B', octave: 3, freq: 246.94, stringNumber: 2 },
      { name: 'G3', note: 'G', octave: 3, freq: 196.00, stringNumber: 3 },
      { name: 'D3', note: 'D', octave: 3, freq: 146.83, stringNumber: 4 },
      { name: 'G2', note: 'G', octave: 2, freq: 98.00,  stringNumber: 5 },
      { name: 'D2', note: 'D', octave: 2, freq: 73.42,  stringNumber: 6 }
    ]
  },
  {
    id: 'eb-standard',
    name: 'Half-Step Down (Eb Standard)',
    description: 'Jimi Hendrix & Stevie Ray Vaughan resonant warm tone (Eb-Ab-Db-Gb-Bb-Eb)',
    strings: [
      { name: 'Eb4', note: 'Eb', octave: 4, freq: 311.13, stringNumber: 1 },
      { name: 'Bb3', note: 'Bb', octave: 3, freq: 233.08, stringNumber: 2 },
      { name: 'Gb3', note: 'Gb', octave: 3, freq: 185.00, stringNumber: 3 },
      { name: 'Db3', note: 'Db', octave: 3, freq: 138.59, stringNumber: 4 },
      { name: 'Ab2', note: 'Ab', octave: 2, freq: 103.83, stringNumber: 5 },
      { name: 'Eb2', note: 'Eb', octave: 2, freq: 77.78,  stringNumber: 6 }
    ]
  }
];

// Reference Chord Library with fingerings (fret -1 = mute, 0 = open)
const GUITAR_CHORDS = [
  { name: 'Em', suffix: 'minor', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1, difficulty: 'Beginner' },
  { name: 'Am', suffix: 'minor', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1, difficulty: 'Beginner' },
  { name: 'C',  suffix: 'major', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1, difficulty: 'Beginner' },
  { name: 'G',  suffix: 'major', frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4], baseFret: 1, difficulty: 'Beginner' },
  { name: 'D',  suffix: 'major', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1, difficulty: 'Beginner' },
  { name: 'F',  suffix: 'barre', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1, barres: [1], difficulty: 'Intermediate' },
  { name: 'Bm', suffix: 'barre', frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 2, barres: [2], difficulty: 'Intermediate' },
  { name: 'A',  suffix: 'major', frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1, difficulty: 'Beginner' },
  { name: 'E',  suffix: 'major', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1, difficulty: 'Beginner' },
  { name: 'Dm', suffix: 'minor', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1, difficulty: 'Beginner' }
];

// Virtual Effects Pedal Definitions
const GUITAR_PEDALS = [
  {
    id: 'pedal-od',
    name: 'Obsidian Drive',
    type: 'Overdrive',
    color: '#10B981',
    description: 'Analog Germanium diode clipping with warm mid-frequency hump',
    controls: [
      { name: 'drive', label: 'Drive', min: 0, max: 100, default: 65 },
      { name: 'tone',  label: 'Tone',  min: 0, max: 100, default: 50 },
      { name: 'level', label: 'Level', min: 0, max: 100, default: 80 }
    ]
  },
  {
    id: 'pedal-delay',
    name: 'Cyber Tape Delay',
    type: 'Delay',
    color: '#06B6D4',
    description: 'Vintage magnetic tape wow/flutter simulation with ping-pong stereo echoes',
    controls: [
      { name: 'time',     label: 'Time (ms)', min: 50, max: 1000, default: 360 },
      { name: 'feedback', label: 'Repeats',   min: 0,  max: 100,  default: 45 },
      { name: 'mix',      label: 'Mix %',     min: 0,  max: 100,  default: 35 }
    ]
  },
  {
    id: 'pedal-reverb',
    name: 'Cathedral Reverb',
    type: 'Reverb',
    color: '#8B5CF6',
    description: 'Lush convolutional reverb modeled after infinite obsidian chambers',
    controls: [
      { name: 'decay', label: 'Decay', min: 0.5, max: 10.0, default: 3.5 },
      { name: 'damp',  label: 'Damp',  min: 0,   max: 100,  default: 40 },
      { name: 'mix',   label: 'Mix %', min: 0,   max: 100,  default: 30 }
    ]
  },
  {
    id: 'pedal-chorus',
    name: 'Liquid Chorus',
    type: 'Modulation',
    color: '#EC4899',
    description: '80s analog bucket-brigade device (BBD) shimmering pitch detune',
    controls: [
      { name: 'rate',  label: 'Speed', min: 0.1, max: 10.0, default: 1.8 },
      { name: 'depth', label: 'Depth', min: 0,   max: 100,  default: 60 },
      { name: 'mix',   label: 'Blend', min: 0,   max: 100,  default: 50 }
    ]
  }
];

/**
 * GET /api/guitar/tracks
 * Query params: category, tuning, difficulty, search
 */
router.get('/tracks', optionalAuth, (req, res) => {
  try {
    const { category, tuning, difficulty, search } = req.query;
    let sql = 'SELECT * FROM guitar_tracks WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }
    if (tuning) {
      sql += ' AND LOWER(tuning) = LOWER(?)';
      params.push(tuning);
    }
    if (difficulty) {
      sql += ' AND LOWER(difficulty) = LOWER(?)';
      params.push(difficulty);
    }
    if (search) {
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(artist_name) LIKE ? OR LOWER(category) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY play_count DESC, id ASC';
    const tracks = dbHelper.all(sql, ...params);

    // If user is authenticated, check liked status
    let likedSet = new Set();
    if (req.user) {
      const liked = dbHelper.all('SELECT track_id FROM liked_songs WHERE user_id = ?', req.user.id);
      likedSet = new Set(liked.map(l => l.track_id));
    }

    const formatted = tracks.map(t => ({
      ...t,
      isLiked: likedSet.has(t.id),
      streamUrl: `/api/tracks/${t.id}/stream`
    }));

    res.json({
      success: true,
      count: formatted.length,
      tracks: formatted
    });
  } catch (err) {
    console.error('Error fetching guitar tracks:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve guitar tracks catalog.' });
  }
});

/**
 * GET /api/guitar/tracks/:id
 */
router.get('/tracks/:id', optionalAuth, (req, res) => {
  try {
    const track = dbHelper.get('SELECT * FROM guitar_tracks WHERE id = ?', req.params.id);
    if (!track) {
      return res.status(404).json({ error: true, message: 'Guitar track not found.' });
    }

    const tab = dbHelper.get('SELECT * FROM guitar_tabs WHERE track_id = ?', track.id);

    let isLiked = false;
    if (req.user) {
      const liked = dbHelper.get('SELECT 1 FROM liked_songs WHERE user_id = ? AND track_id = ?', req.user.id, track.id);
      isLiked = !!liked;
    }

    res.json({
      success: true,
      track: {
        ...track,
        isLiked,
        tab: tab ? {
          ...tab,
          chords: tab.chords_json ? JSON.parse(tab.chords_json) : []
        } : null,
        streamUrl: `/api/tracks/${track.id}/stream`
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to retrieve guitar track.' });
  }
});

/**
 * GET /api/guitar/categories
 */
router.get('/categories', (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'All Guitars', icon: 'Guitar', description: 'Complete catalog across all acoustic, electric, and classical styles' },
      { id: 'electric', name: 'Electric Guitar', icon: 'Zap', description: 'Overdriven solos, heavy riffs, and neon cyber sounds' },
      { id: 'acoustic', name: 'Acoustic Guitar', icon: 'Music2', description: 'Rich resonant dreadnoughts and fingerpicked acoustics' },
      { id: 'fingerstyle', name: 'Fingerstyle', icon: 'Waves', description: 'Intricate percussive and harmonic masterworks' },
      { id: 'flamenco', name: 'Flamenco & Classical', icon: 'Guitar', description: 'Nylon string passion, rapid rasgueados, and modal runs' },
      { id: 'blues', name: 'Blues & Slide', icon: 'Music2', description: 'Soulful delta slides and pentatonic expression' }
    ];

    // Compute track count per category from DB
    const counts = dbHelper.all(`
      SELECT LOWER(category) as cat, COUNT(*) as count 
      FROM guitar_tracks 
      GROUP BY LOWER(category)
    `);
    const countMap = Object.fromEntries(counts.map(c => [c.cat, c.count]));

    const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

    const categoriesWithCount = categories.map(c => ({
      ...c,
      trackCount: c.id === 'all' ? totalCount : (countMap[c.id.toLowerCase()] || 0)
    }));

    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to fetch guitar categories.' });
  }
});

/**
 * GET /api/guitar/tunings
 */
router.get('/tunings', (req, res) => {
  res.json({
    success: true,
    tunings: GUITAR_TUNINGS
  });
});

/**
 * GET /api/guitar/chords
 */
router.get('/chords', (req, res) => {
  res.json({
    success: true,
    chords: GUITAR_CHORDS
  });
});

/**
 * GET /api/guitar/pedals
 */
router.get('/pedals', (req, res) => {
  res.json({
    success: true,
    pedals: GUITAR_PEDALS
  });
});

/**
 * GET /api/guitar/tabs
 */
router.get('/tabs', (req, res) => {
  try {
    const tabs = dbHelper.all('SELECT * FROM guitar_tabs ORDER BY id ASC');
    res.json({
      success: true,
      count: tabs.length,
      tabs: tabs.map(t => ({
        ...t,
        chords: t.chords_json ? JSON.parse(t.chords_json) : []
      }))
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to retrieve tablature library.' });
  }
});

/**
 * GET /api/guitar/tabs/:id
 */
router.get('/tabs/:id', (req, res) => {
  try {
    const tab = dbHelper.get('SELECT * FROM guitar_tabs WHERE id = ? OR track_id = ?', req.params.id, req.params.id);
    if (!tab) {
      return res.status(404).json({ error: true, message: 'Tablature not found.' });
    }
    res.json({
      success: true,
      tab: {
        ...tab,
        chords: tab.chords_json ? JSON.parse(tab.chords_json) : []
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to retrieve tab details.' });
  }
});

/**
 * GET /api/guitar/presets
 */
router.get('/presets', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const presets = dbHelper.all('SELECT * FROM guitar_presets WHERE user_id = ? OR is_default = 1 ORDER BY is_default DESC, created_at DESC', userId);
    res.json({
      success: true,
      presets: presets.map(p => ({
        ...p,
        pedals: p.pedals_json ? JSON.parse(p.pedals_json) : []
      }))
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to retrieve presets.' });
  }
});

/**
 * POST /api/guitar/presets
 */
router.post('/presets', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const { name, amp_type = 'Tube Modern', gain = 0.5, bass = 0.5, mid = 0.5, treble = 0.5, pedals = [] } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: true, message: 'Preset name is required.' });
    }

    const presetId = `preset-${Date.now()}`;
    const pedalsJson = JSON.stringify(pedals);

    dbHelper.run(`
      INSERT INTO guitar_presets (id, user_id, name, amp_type, gain, bass, mid, treble, pedals_json, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, presetId, userId, name.trim(), amp_type, gain, bass, mid, treble, pedalsJson);

    res.status(201).json({
      success: true,
      message: 'Preset saved successfully.',
      preset: {
        id: presetId,
        user_id: userId,
        name: name.trim(),
        amp_type,
        gain,
        bass,
        mid,
        treble,
        pedals,
        is_default: false
      }
    });
  } catch (err) {
    console.error('Error saving preset:', err);
    res.status(500).json({ error: true, message: 'Failed to save guitar preset.' });
  }
});

/**
 * DELETE /api/guitar/presets/:id
 */
router.delete('/presets/:id', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const preset = dbHelper.get('SELECT * FROM guitar_presets WHERE id = ?', req.params.id);

    if (!preset) {
      return res.status(404).json({ error: true, message: 'Preset not found.' });
    }

    if (preset.is_default) {
      return res.status(403).json({ error: true, message: 'Cannot delete default system presets.' });
    }

    dbHelper.run('DELETE FROM guitar_presets WHERE id = ? AND user_id = ?', req.params.id, userId);
    res.json({ success: true, message: 'Preset deleted.' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Failed to delete preset.' });
  }
});

export default router;
