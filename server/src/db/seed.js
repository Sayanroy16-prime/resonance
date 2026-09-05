import bcrypt from 'bcryptjs';
import { db, dbHelper, initSchema } from './database.js';

export const seedDatabase = async () => {
  console.log('⚡ Starting Resonance database seed...');
  initSchema();

  // Clear existing tables in reverse dependency order
  db.exec(`
    DELETE FROM guitar_presets;
    DELETE FROM guitar_tabs;
    DELETE FROM guitar_tracks;
    DELETE FROM player_sessions;
    DELETE FROM followed_artists;
    DELETE FROM user_history;
    DELETE FROM liked_songs;
    DELETE FROM playlist_tracks;
    DELETE FROM playlists;
    DELETE FROM tracks;
    DELETE FROM albums;
    DELETE FROM artists;
    DELETE FROM users;
  `);

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, phone, password_hash, display_name, avatar_url, provider, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'usr-demo',
    'audiophile',
    'audiophile@gmail.com',
    '+1 555-0199',
    passwordHash,
    'Alex Vance',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'local',
    'listener'
  );

  insertUser.run(
    'usr-admin',
    'curator',
    'curator@resonance.fm',
    '+1 555-0188',
    passwordHash,
    'OBSIDIAN Editorial',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'local',
    'admin'
  );

  insertUser.run(
    'usr-guest',
    'guest_listener',
    'guest@resonance.fm',
    null,
    passwordHash,
    'Guest Listener',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'guest',
    'listener'
  );

  // 2. Seed Artists
  const insertArtist = db.prepare(`
    INSERT INTO artists (id, name, bio, image_url, header_url, monthly_listeners, verified, genre)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const artistsData = [
    {
      id: 'artist-1',
      name: 'XOR Collective',
      bio: 'Leading force in obsidian industrial techno and sub-bass audio architecture.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 3420890,
      genre: 'Industrial Techno'
    },
    {
      id: 'artist-2',
      name: 'Vance Core',
      bio: 'Analog synthesizer producer crafting deep nocturnal soundscapes with tube saturation.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 1890120,
      genre: 'Dark Synth'
    },
    {
      id: 'artist-3',
      name: 'Gridlocked',
      bio: 'High-octane cybernetic electronica and digital glitch soundscapes.',
      imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 892300,
      genre: 'Cyberpunk'
    },
    {
      id: 'artist-4',
      name: 'Looming Dark',
      bio: 'Ethereal ambient textures designed for zero-latency meditation and deep focus.',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 2150000,
      genre: 'Ambient'
    },
    {
      id: 'artist-5',
      name: 'The Offset',
      bio: 'Experimental bass music pioneer exploring heavyweight low-frequency modulations.',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 5410000,
      genre: 'Electronic'
    },
    {
      id: 'artist-6',
      name: 'Phase Shift',
      bio: 'Tape-warm lofi beats infused with modular acoustic resonances.',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 1120400,
      genre: 'Lofi'
    },
    {
      id: 'artist-7',
      name: 'Vector Prime',
      bio: 'Neo-Tokyo synthwave architect crafting cinematic night-drive anthems.',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 2780000,
      genre: 'Synthwave'
    },
    {
      id: 'artist-8',
      name: 'Aetheria',
      bio: 'Dream-pop synthscapes and crystal reverb harmonies.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 1650300,
      genre: 'Ambient Pop'
    },
    {
      id: 'artist-g1',
      name: 'Neon Strings',
      bio: 'Cybernetic shred pioneer blending high-voltage analog humbuckers with spatial synth pads.',
      imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 2100000,
      genre: 'Electric Guitar'
    },
    {
      id: 'artist-g2',
      name: 'Chromatic Arc',
      bio: 'Acoustic dreadnought virtuoso playing microtonal harmonics and rhythmic body-slaps.',
      imageUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 890000,
      genre: 'Acoustic Guitar'
    },
    {
      id: 'artist-g3',
      name: 'The Wooden Keys',
      bio: 'Folk fingerstyle master creating meditative modal soundscapes in alternate tunings.',
      imageUrl: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 1450000,
      genre: 'Fingerstyle'
    },
    {
      id: 'artist-g4',
      name: 'Axe Division',
      bio: 'Heavy drop-tuned precision riffing with brutal distortion and tight gate dynamics.',
      imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 3200000,
      genre: 'Metal'
    },
    {
      id: 'artist-g5',
      name: 'Aldea Suave',
      bio: 'Classical Spanish guitarist exploring nylon-string romanticism and intricate arpeggios.',
      imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 760000,
      genre: 'Classical Guitar'
    },
    {
      id: 'artist-g6',
      name: 'Delta Circuit',
      bio: 'Brass slide guitarist blending traditional Mississippi mud with analog tube saturators.',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
      headerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      monthlyListeners: 1890000,
      genre: 'Blues Guitar'
    }
  ];

  for (const art of artistsData) {
    insertArtist.run(art.id, art.name, art.bio, art.imageUrl, art.headerUrl, art.monthlyListeners, 1, art.genre);
  }

  // 3. Seed Albums (Including all 12 featured circular albums)
  const insertAlbum = db.prepare(`
    INSERT INTO albums (id, title, artist_id, release_year, cover_url, album_type, genre, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const albumsData = [
    {
      id: 'album-1',
      title: 'OBSIDIAN ESSENTIALS 2026',
      artistId: 'artist-1',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      genre: 'Industrial Techno',
      description: 'The dark wave benchmark. Curated heavy industrial techno, cyber-synth soundtracks, and premium offline listening favorites.'
    },
    {
      id: 'album-2',
      title: 'Matte Dynamics',
      artistId: 'artist-2',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
      genre: 'Dark Synth',
      description: 'Deep low-frequency basslines recorded with vintage tape warmth.'
    },
    {
      id: 'album-3',
      title: 'Cyber City 2099',
      artistId: 'artist-7',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      genre: 'Synthwave',
      description: 'High-octane industrial darksynth designed for nocturnal cyber racers.'
    },
    {
      id: 'album-4',
      title: 'Modular Sessions',
      artistId: 'artist-6',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      genre: 'Lofi',
      description: 'Analog tape sessions capturing authentic vinyl crackle and vintage warmth.'
    },
    {
      id: 'album-5',
      title: 'Quantum Frequency',
      artistId: 'artist-5',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      genre: 'Electronic',
      description: 'Sub-harmonic audio experiments testing the physical resonance limits of modern speakers.'
    },
    {
      id: 'album-6',
      title: 'Neon Horizons',
      artistId: 'artist-7',
      releaseYear: 2025,
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      genre: 'Synthwave',
      description: 'Lush 80s analog synthesizers meet futuristic hyper-pop arrangements.'
    },
    {
      id: 'album-7',
      title: 'Analog Tape Reverie',
      artistId: 'artist-4',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      genre: 'Ambient',
      description: 'Endless tape loop meditations and tape saturation sound design.'
    },
    {
      id: 'album-8',
      title: 'Sub-Zero Synthetics',
      artistId: 'artist-3',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      genre: 'Cyberpunk',
      description: 'Glitch aesthetics, cybernetic distortion, and cold industrial drum sequences.'
    },
    {
      id: 'album-9',
      title: 'Acoustic Resonance',
      artistId: 'artist-g2',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=80',
      genre: 'Acoustic Guitar',
      description: 'High-definition recordings of hand-crafted dreadnoughts and flamenco nylon strings.'
    },
    {
      id: 'album-10',
      title: 'Midnight Drift',
      artistId: 'artist-2',
      releaseYear: 2025,
      coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      genre: 'Dark Synth',
      description: 'Nocturnal soundscapes designed for empty highways and quiet metropolitan nights.'
    },
    {
      id: 'album-11',
      title: 'Solar Flare Audio',
      artistId: 'artist-g1',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
      genre: 'Electric Guitar',
      description: 'Blistering lead guitar solos drenched in tape delay and high-gain vacuum tubes.'
    },
    {
      id: 'album-12',
      title: 'Infinite Echoes',
      artistId: 'artist-8',
      releaseYear: 2026,
      coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      genre: 'Ambient Pop',
      description: 'Crystalline reverb washes and emotional vocal chops suspended in stereo depth.'
    }
  ];

  for (const alb of albumsData) {
    insertAlbum.run(alb.id, alb.title, alb.artistId, alb.releaseYear, alb.coverUrl, 'album', alb.genre, alb.description);
  }

  // 4. Seed Tracks
  const insertTrack = db.prepare(`
    INSERT INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tracksData = [
    {
      id: 'track-1',
      title: 'Metavoid Symphony',
      artistId: 'artist-1',
      artistName: 'XOR Collective',
      albumId: 'album-1',
      albumTitle: 'OBSIDIAN ESSENTIALS 2026',
      duration: 262,
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      genre: 'Industrial Techno',
      releaseYear: 2026,
      playCount: 3420890,
      isExplicit: 0,
      lyrics: `[00:12.00] Echoes in the dark void\n[00:24.00] Resonance is breaking through\n[00:36.00] In the shadows we remain\n[00:48.00] Electric pulse running through our veins\n[01:00.00] Metavoid awakens now`
    },
    {
      id: 'track-2',
      title: 'Sub-Zero Pulse',
      artistId: 'artist-2',
      artistName: 'Vance Core',
      albumId: 'album-2',
      albumTitle: 'Matte Dynamics',
      duration: 218,
      coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      genre: 'Dark Synth',
      releaseYear: 2026,
      playCount: 1890120,
      isExplicit: 0,
      lyrics: `[00:15.00] Beneath the freezing surface\n[00:28.00] The bassline starts to vibrate\n[00:42.00] Can you hear the analog current\n[00:55.00] Pulse... pulse... pulse`
    },
    {
      id: 'track-3',
      title: 'Cyber Protocol 9',
      artistId: 'artist-3',
      artistName: 'Gridlocked',
      albumId: 'album-3',
      albumTitle: 'Cyber City 2099',
      duration: 194,
      coverUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      genre: 'Cyberpunk',
      releaseYear: 2026,
      playCount: 892300,
      isExplicit: 1,
      lyrics: `[00:08.00] Initializing protocol nine\n[00:18.00] Firewall breach detected\n[00:30.00] Overriding system lock\n[00:44.00] Digital adrenaline unleashed`
    },
    {
      id: 'track-4',
      title: 'Liquid Nitrogen',
      artistId: 'artist-4',
      artistName: 'Looming Dark',
      albumId: null,
      albumTitle: null,
      duration: 312,
      coverUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      genre: 'Ambient',
      releaseYear: 2025,
      playCount: 2150000,
      isExplicit: 0,
      lyrics: `[00:20.00] Cold mist drift across silence\n[00:50.00] Frozen in time and memory\n[01:20.00] Slow motion harmony`
    },
    {
      id: 'track-5',
      title: 'Carbon Footprint',
      artistId: 'artist-5',
      artistName: 'The Offset',
      albumId: 'album-5',
      albumTitle: 'Quantum Frequency',
      duration: 260,
      coverUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      genre: 'Electronic',
      releaseYear: 2026,
      playCount: 5410000,
      isExplicit: 0,
      lyrics: `[00:14.00] Sub-bass waves shaking the ground\n[00:28.00] Heavy modulation frequency`
    },
    {
      id: 'track-6',
      title: 'Tape Warp Sanctuary',
      artistId: 'artist-6',
      artistName: 'Phase Shift',
      albumId: 'album-4',
      albumTitle: 'Modular Sessions',
      duration: 175,
      coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      genre: 'Lofi',
      releaseYear: 2026,
      playCount: 1120400,
      isExplicit: 0,
      lyrics: `[00:10.00] Vinyl needle drops onto groove\n[00:30.00] Warm cassette hiss embraces the room`
    },
    {
      id: 'track-7',
      title: 'Neo-Tokyo Overdrive',
      artistId: 'artist-7',
      artistName: 'Vector Prime',
      albumId: 'album-3',
      albumTitle: 'Cyber City 2099',
      duration: 228,
      coverUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      genre: 'Synthwave',
      releaseYear: 2026,
      playCount: 2780000,
      isExplicit: 0,
      lyrics: `[00:15.00] Red taillights streaking through the neon rain\n[00:35.00] Turbo engine screaming through Shibuya`
    },
    {
      id: 'track-8',
      title: 'Obsidian Descent',
      artistId: 'artist-1',
      artistName: 'XOR Collective',
      albumId: 'album-1',
      albumTitle: 'OBSIDIAN ESSENTIALS 2026',
      duration: 284,
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      genre: 'Industrial Techno',
      releaseYear: 2026,
      playCount: 1980000,
      isExplicit: 0,
      lyrics: `[00:20.00] Gravity pulls us down into obsidian\n[00:45.00] Pure rhythm, pure focus`
    },
    // Also include Guitar Studio tracks in tracks table for global search & playlist addition!
    {
      id: 'track-g1',
      title: 'Cascade Riff',
      artistId: 'artist-g1',
      artistName: 'Neon Strings',
      albumId: 'album-11',
      albumTitle: 'Solar Flare Audio',
      duration: 240,
      coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      genre: 'Electric Guitar',
      releaseYear: 2026,
      playCount: 2100000,
      isExplicit: 0,
      lyrics: `[00:10.00] Neon strings cascading through the night\n[00:30.00] Electric resonance takes flight`
    },
    {
      id: 'track-g2',
      title: 'Steel Dreams',
      artistId: 'artist-g2',
      artistName: 'Chromatic Arc',
      albumId: 'album-9',
      albumTitle: 'Acoustic Resonance',
      duration: 213,
      coverUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      genre: 'Acoustic Guitar',
      releaseYear: 2026,
      playCount: 890000,
      isExplicit: 0,
      lyrics: `[00:12.00] Steel strings singing in the amber dusk\n[00:34.00] Wooden resonance in hollow trust`
    },
    {
      id: 'track-g3',
      title: 'Acoustic Veil',
      artistId: 'artist-g3',
      artistName: 'The Wooden Keys',
      albumId: 'album-9',
      albumTitle: 'Acoustic Resonance',
      duration: 195,
      coverUrl: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      genre: 'Acoustic Guitar',
      releaseYear: 2025,
      playCount: 1450000,
      isExplicit: 0,
      lyrics: `[00:08.00] Acoustic warmth floating through silent space\n[00:25.00] DADGAD strings create a holy place`
    },
    {
      id: 'track-g4',
      title: 'Fretfire Protocol',
      artistId: 'artist-g4',
      artistName: 'Axe Division',
      albumId: 'album-8',
      albumTitle: 'Sub-Zero Synthetics',
      duration: 258,
      coverUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      genre: 'Electric Guitar',
      releaseYear: 2026,
      playCount: 3200000,
      isExplicit: 1,
      lyrics: `[00:15.00] Distortion overload, frequency shred\n[00:38.00] Palm-muted drop D tearing ahead`
    },
    {
      id: 'track-g5',
      title: 'Nylon Reverie',
      artistId: 'artist-g5',
      artistName: 'Aldea Suave',
      albumId: 'album-9',
      albumTitle: 'Acoustic Resonance',
      duration: 222,
      coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      genre: 'Classical Guitar',
      releaseYear: 2025,
      playCount: 760000,
      isExplicit: 0,
      lyrics: `[00:05.00] Nylon strings breathe in suspended motion\n[00:32.00] Spanish arpeggios crossing the ocean`
    },
    {
      id: 'track-g6',
      title: 'Slide Protocol',
      artistId: 'artist-g6',
      artistName: 'Delta Circuit',
      albumId: null,
      albumTitle: null,
      duration: 234,
      coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
      genre: 'Blues Guitar',
      releaseYear: 2026,
      playCount: 1890000,
      isExplicit: 0,
      lyrics: `[00:18.00] Slide guitar cutting through the delta fog\n[00:40.00] Tube amp warming up the southern bog`
    }
  ];

  for (const tr of tracksData) {
    insertTrack.run(
      tr.id, tr.title, tr.artistId, tr.artistName, tr.albumId, tr.albumTitle,
      tr.duration, tr.audioUrl, tr.coverUrl, tr.genre, tr.releaseYear, tr.playCount, tr.isExplicit, tr.lyrics
    );
  }

  // 5. Seed Guitar Tracks Table
  const insertGuitarTrack = db.prepare(`
    INSERT INTO guitar_tracks (id, title, artist_name, category, tuning, bpm, key_signature, difficulty, duration, audio_url, cover_url, tab_preview, lyrics, play_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const guitarTracksData = [
    {
      id: 'track-g1',
      title: 'Cascade Riff',
      artistName: 'Neon Strings',
      category: 'electric',
      tuning: 'Standard E',
      bpm: 128,
      keySignature: 'Em',
      difficulty: 'Intermediate',
      duration: 240,
      coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      tabPreview: 'e|---12--14--15--14-12----|',
      lyrics: '[00:10.00] Neon strings cascading through the night',
      playCount: 2100000
    },
    {
      id: 'track-g2',
      title: 'Steel Dreams',
      artistName: 'Chromatic Arc',
      category: 'acoustic',
      tuning: 'Standard E',
      bpm: 95,
      keySignature: 'G',
      difficulty: 'Beginner',
      duration: 213,
      coverUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      tabPreview: 'e|-------3-----------3---|',
      lyrics: '[00:12.00] Steel strings singing in the amber dusk',
      playCount: 890000
    },
    {
      id: 'track-g3',
      title: 'Acoustic Veil',
      artistName: 'The Wooden Keys',
      category: 'fingerstyle',
      tuning: 'DADGAD',
      bpm: 82,
      keySignature: 'D',
      difficulty: 'Intermediate',
      duration: 195,
      coverUrl: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      tabPreview: 'D|-------0-----0---------|',
      lyrics: '[00:08.00] Acoustic warmth floating through silent space',
      playCount: 1450000
    },
    {
      id: 'track-g4',
      title: 'Fretfire Protocol',
      artistName: 'Axe Division',
      category: 'electric',
      tuning: 'Drop D',
      bpm: 145,
      keySignature: 'Dm',
      difficulty: 'Advanced',
      duration: 258,
      coverUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      tabPreview: 'D|---0-0-0--3-0--5-0-3---|',
      lyrics: '[00:15.00] Distortion overload, frequency shred',
      playCount: 3200000
    },
    {
      id: 'track-g5',
      title: 'Nylon Reverie',
      artistName: 'Aldea Suave',
      category: 'flamenco',
      tuning: 'Standard E',
      bpm: 78,
      keySignature: 'Am',
      difficulty: 'Master',
      duration: 222,
      coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      tabPreview: 'e|---0---1p0---0---------|',
      lyrics: '[00:05.00] Nylon strings breathe in suspended motion',
      playCount: 760000
    },
    {
      id: 'track-g6',
      title: 'Slide Protocol',
      artistName: 'Delta Circuit',
      category: 'blues',
      tuning: 'Open G',
      bpm: 104,
      keySignature: 'G',
      difficulty: 'Intermediate',
      duration: 234,
      coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
      tabPreview: 'D|---/12---12\\10---8/10--|',
      lyrics: '[00:18.00] Slide guitar cutting through the delta fog',
      playCount: 1890000
    }
  ];

  for (const gt of guitarTracksData) {
    insertGuitarTrack.run(
      gt.id, gt.title, gt.artistName, gt.category, gt.tuning,
      gt.bpm, gt.keySignature, gt.difficulty, gt.duration, gt.audioUrl,
      gt.coverUrl, gt.tabPreview, gt.lyrics, gt.playCount
    );
  }

  // 6. Seed Guitar Tablature
  const insertTab = db.prepare(`
    INSERT INTO guitar_tabs (id, track_id, title, artist, tuning, capo, difficulty, tab_content, chords_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tabsData = [
    {
      id: 'tab-1',
      trackId: 'track-g1',
      title: 'Cascade Riff Tab',
      artist: 'Neon Strings',
      tuning: 'Standard E (E-A-D-G-B-E)',
      capo: 0,
      difficulty: 'Intermediate',
      tabContent: `[Intro / Main Theme]
e|---------------------------------|---------------------------------|
B|-------12-14-15----14p12---------|-------12-14-15----17b19-15------|
G|---/14-------------------14-12---|---/14---------------------------|
D|---------------------------------|---------------------------------|
A|---------------------------------|---------------------------------|
E|---------------------------------|---------------------------------|

[Verse Chords: Em - G - C - D]
   Em                G                 C                 D
e|--0-----------------3-----------------0-----------------2----------|
B|--0-----------------0-----------------1-----------------3----------|
G|--0-----------------0-----------------0-----------------2----------|
D|--2-----------------0-----------------2-----------------0----------|
A|--2-----------------2-----------------3----------------------------|
E|--0-----------------3----------------------------------------------|`,
      chords: ['Em', 'G', 'C', 'D']
    },
    {
      id: 'tab-2',
      trackId: 'track-g2',
      title: 'Steel Dreams Tab',
      artist: 'Chromatic Arc',
      tuning: 'Standard E (E-A-D-G-B-E)',
      capo: 2,
      difficulty: 'Beginner',
      tabContent: `[Acoustic Fingerpicking Pattern]
   G                                 Cadd9
e|-------3---------------3---------|-------3---------------3---------|
B|-----------0---------------0-----|-----------3---------------3-----|
G|---------------0---------------0-|---------------0---------------0-|
D|-------------------0-------------|-------------------2-------------|
A|---------------------------------|-3-------------------------------|
E|-3-------------------------------|---------------------------------|

   Em7                               D/F#
e|-------3---------------3---------|-------2---------------2---------|
B|-----------3---------------3-----|-----------3---------------3-----|
G|---------------0---------------0-|---------------2---------------2-|
D|-------------------2-------------|-------------------0-------------|
A|-2-------------------------------|---------------------------------|
E|---------------------------------|-2-------------------------------|`,
      chords: ['G', 'Cadd9', 'Em7', 'D/F#']
    },
    {
      id: 'tab-3',
      trackId: 'track-g3',
      title: 'Acoustic Veil (DADGAD)',
      artist: 'The Wooden Keys',
      tuning: 'DADGAD',
      capo: 3,
      difficulty: 'Intermediate',
      tabContent: `[Modal Harp Arpeggios]
D|-------0-----------0-------------|-------0-----------0-------------|
A|---------0-----------0-----------|---------0-----------0-----------|
G|-----0-----0-----0-----0---------|-----2-----2-----2-----2---------|
D|---4-----------4-----------------|---0-----------0-----------------|
A|-5-----------5-------------------|-0-----------0-------------------|
D|---------------------------------|---------------------------------|`,
      chords: ['Dsus4', 'Gadd9', 'Asus4', 'Bm7']
    },
    {
      id: 'tab-4',
      trackId: 'track-g4',
      title: 'Fretfire Heavy Drop D',
      artist: 'Axe Division',
      tuning: 'Drop D (D-A-D-G-B-E)',
      capo: 0,
      difficulty: 'Advanced',
      tabContent: `[Main Heavy Riff - High Gain]
D|--0-0-0---3-0---5-0-3-0---5b6-3--|--0-0-0---3-0---5-0-3-0---7-5-3--|
A|--0-0-0---3-0---5-0-3-0---5b6-3--|--0-0-0---3-0---5-0-3-0---7-5-3--|
D|--0-0-0---3-0---5-0-3-0---5b6-3--|--0-0-0---3-0---5-0-3-0---7-5-3--|
   PM...   PM..  PM..........         PM...   PM..  PM...........`,
      chords: ['D5', 'F5', 'G5', 'Ab5', 'A5']
    }
  ];

  for (const tab of tabsData) {
    insertTab.run(
      tab.id, tab.trackId, tab.title, tab.artist, tab.tuning,
      tab.capo, tab.difficulty, tab.tabContent, JSON.stringify(tab.chords)
    );
  }

  // 7. Seed Default Guitar Presets
  const insertPreset = db.prepare(`
    INSERT INTO guitar_presets (id, user_id, name, amp_type, gain, bass, mid, treble, pedals_json, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const presetsData = [
    {
      id: 'preset-default-1',
      userId: 'usr-demo',
      name: 'Obsidian Modern Lead',
      ampType: 'Tube Modern',
      gain: 0.75,
      bass: 0.6,
      mid: 0.7,
      treble: 0.65,
      pedals: [
        { id: 'pedal-od', enabled: true, params: { drive: 70, tone: 60, level: 85 } },
        { id: 'pedal-delay', enabled: true, params: { time: 420, feedback: 40, mix: 30 } },
        { id: 'pedal-reverb', enabled: true, params: { decay: 3.2, damp: 45, mix: 25 } }
      ],
      isDefault: 1
    },
    {
      id: 'preset-default-2',
      userId: 'usr-demo',
      name: 'Cathedral Acoustic Clean',
      ampType: 'Acoustic Sim',
      gain: 0.25,
      bass: 0.5,
      mid: 0.55,
      treble: 0.8,
      pedals: [
        { id: 'pedal-chorus', enabled: true, params: { rate: 1.2, depth: 45, mix: 35 } },
        { id: 'pedal-reverb', enabled: true, params: { decay: 4.8, damp: 30, mix: 40 } }
      ],
      isDefault: 1
    },
    {
      id: 'preset-default-3',
      userId: 'usr-demo',
      name: 'Drop D Cyber Shredder',
      ampType: 'High Gain Metal',
      gain: 0.9,
      bass: 0.7,
      mid: 0.45,
      treble: 0.85,
      pedals: [
        { id: 'pedal-od', enabled: true, params: { drive: 85, tone: 75, level: 90 } },
        { id: 'pedal-delay', enabled: false, params: { time: 300, feedback: 25, mix: 20 } }
      ],
      isDefault: 1
    }
  ];

  for (const pr of presetsData) {
    insertPreset.run(
      pr.id, pr.userId, pr.name, pr.ampType, pr.gain,
      pr.bass, pr.mid, pr.treble, JSON.stringify(pr.pedals), pr.isDefault
    );
  }

  // 8. Seed Playlists & Playlist Tracks
  const insertPlaylist = db.prepare(`
    INSERT INTO playlists (id, user_id, title, description, cover_url, is_public, is_editorial)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPlaylistTrack = db.prepare(`
    INSERT INTO playlist_tracks (playlist_id, track_id, position)
    VALUES (?, ?, ?)
  `);

  const playlistsData = [
    {
      id: 'playlist-1',
      userId: 'usr-admin',
      title: 'Late Night Obsidian',
      description: 'Curated dark ambient & heavy techno for late night sessions.',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      isPublic: 1,
      isEditorial: 1,
      tracks: ['track-1', 'track-2', 'track-4', 'track-8', 'track-g1']
    },
    {
      id: 'playlist-2',
      userId: 'usr-admin',
      title: 'Cyberpunk Beats 2026',
      description: 'Heavy synthwave & glitch protocol sounds.',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      isPublic: 1,
      isEditorial: 1,
      tracks: ['track-3', 'track-5', 'track-7', 'track-g4']
    },
    {
      id: 'playlist-3',
      userId: 'usr-admin',
      title: 'Focus & Flow (Matte)',
      description: 'Deep ambient textures for uninterrupted concentration.',
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      isPublic: 1,
      isEditorial: 1,
      tracks: ['track-4', 'track-5', 'track-6', 'track-g2', 'track-g3']
    },
    {
      id: 'playlist-guitar',
      userId: 'usr-admin',
      title: 'Resonance Guitar Vault',
      description: 'Master studio guitar recordings featuring electric leads and acoustic fingerpicking.',
      coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
      isPublic: 1,
      isEditorial: 1,
      tracks: ['track-g1', 'track-g2', 'track-g3', 'track-g4', 'track-g5', 'track-g6']
    },
    {
      id: 'playlist-custom-1',
      userId: 'usr-demo',
      title: 'My Nocturnal Mix',
      description: 'Personal favorite late night synth tracks.',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      isPublic: 1,
      isEditorial: 0,
      tracks: ['track-1', 'track-7', 'track-8', 'track-g1']
    }
  ];

  for (const pl of playlistsData) {
    insertPlaylist.run(pl.id, pl.userId, pl.title, pl.description, pl.coverUrl, pl.isPublic, pl.isEditorial);
    pl.tracks.forEach((trackId, idx) => {
      insertPlaylistTrack.run(pl.id, trackId, idx + 1);
    });
  }

  // 9. Seed Liked Songs & History for Demo User
  const insertLiked = db.prepare(`INSERT INTO liked_songs (user_id, track_id) VALUES (?, ?)`);
  insertLiked.run('usr-demo', 'track-1');
  insertLiked.run('usr-demo', 'track-2');
  insertLiked.run('usr-demo', 'track-7');
  insertLiked.run('usr-demo', 'track-g1');
  insertLiked.run('usr-demo', 'track-g2');

  const insertHistory = db.prepare(`
    INSERT INTO user_history (user_id, track_id, duration_played)
    VALUES (?, ?, ?)
  `);
  insertHistory.run('usr-demo', 'track-1', 262);
  insertHistory.run('usr-demo', 'track-g1', 240);
  insertHistory.run('usr-demo', 'track-7', 228);
  insertHistory.run('usr-demo', 'track-2', 150);

  // 10. Seed Followed Artists
  const insertFollow = db.prepare(`INSERT INTO followed_artists (user_id, artist_id) VALUES (?, ?)`);
  insertFollow.run('usr-demo', 'artist-1');
  insertFollow.run('usr-demo', 'artist-7');
  insertFollow.run('usr-demo', 'artist-g1');

  console.log('✅ Resonance database successfully seeded with Spotify-grade catalog & Guitar Studio!');
};

// Execute if run directly via CLI
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error seeding database:', err);
      process.exit(1);
    });
}
