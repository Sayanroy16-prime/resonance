-- Resonance Spotify-Grade Relational Database Schema
PRAGMA foreign_keys = ON;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password_hash TEXT,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    provider TEXT DEFAULT 'local', -- 'local', 'phone', 'google', 'guest'
    role TEXT DEFAULT 'listener',   -- 'listener', 'creator', 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Artists Table
CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    header_url TEXT,
    monthly_listeners INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT 1,
    genre TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Albums Table
CREATE TABLE IF NOT EXISTS albums (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist_id TEXT NOT NULL,
    release_year INTEGER,
    cover_url TEXT,
    album_type TEXT DEFAULT 'album', -- 'album', 'single', 'ep', 'compilation'
    genre TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Tracks Table
CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist_id TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    album_id TEXT,
    album_title TEXT,
    duration INTEGER NOT NULL, -- seconds
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    genre TEXT NOT NULL,
    release_year INTEGER,
    play_count INTEGER DEFAULT 0,
    is_explicit BOOLEAN DEFAULT 0,
    lyrics TEXT, -- Plain lyrics or LRC timestamped format
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
);

-- Playlists Table
CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN DEFAULT 1,
    is_editorial BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Playlist Tracks Junction Table (Ordering preserved by position)
CREATE TABLE IF NOT EXISTS playlist_tracks (
    playlist_id TEXT NOT NULL,
    track_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, track_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

-- Liked / Favorited Songs
CREATE TABLE IF NOT EXISTS liked_songs (
    user_id TEXT NOT NULL,
    track_id TEXT NOT NULL,
    liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, track_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

-- User Listening History (Recently Played)
CREATE TABLE IF NOT EXISTS user_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    track_id TEXT NOT NULL,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_played INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
);

-- Artist Followers
CREATE TABLE IF NOT EXISTS followed_artists (
    user_id TEXT NOT NULL,
    artist_id TEXT NOT NULL,
    followed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, artist_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Active Player Sessions (Spotify Connect Cloud State)
CREATE TABLE IF NOT EXISTS player_sessions (
    user_id TEXT PRIMARY KEY,
    active_device_id TEXT,
    current_track_id TEXT,
    is_playing BOOLEAN DEFAULT 0,
    progress_ms INTEGER DEFAULT 0,
    volume REAL DEFAULT 0.8,
    repeat_mode TEXT DEFAULT 'off', -- 'off', 'all', 'one'
    is_shuffle BOOLEAN DEFAULT 0,
    queue_json TEXT, -- JSON serialized track ID array
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_track_id) REFERENCES tracks(id) ON DELETE SET NULL
);

-- Indexes for lightning fast searching and joining
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(title);
CREATE INDEX IF NOT EXISTS idx_albums_artist ON albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON playlist_tracks(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_liked_songs_user ON liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_history_user ON user_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_history_played ON user_history(user_id, played_at DESC);

-- Guitar Section: Studio Tracks
CREATE TABLE IF NOT EXISTS guitar_tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'electric', 'acoustic', 'fingerstyle', 'flamenco', 'blues', 'metal'
    tuning TEXT DEFAULT 'Standard E',
    bpm INTEGER DEFAULT 120,
    key_signature TEXT DEFAULT 'Am',
    difficulty TEXT DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced', 'Master'
    duration INTEGER NOT NULL,
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    tab_preview TEXT,
    lyrics TEXT,
    play_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Guitar Section: Tablature & Chords
CREATE TABLE IF NOT EXISTS guitar_tabs (
    id TEXT PRIMARY KEY,
    track_id TEXT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    tuning TEXT DEFAULT 'Standard E',
    capo INTEGER DEFAULT 0,
    difficulty TEXT DEFAULT 'Intermediate',
    tab_content TEXT NOT NULL,
    chords_json TEXT, -- JSON array of chords e.g. ["Em", "G", "C", "D"]
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (track_id) REFERENCES guitar_tracks(id) ON DELETE CASCADE
);

-- Guitar Section: Virtual Pedals & Amp Presets
CREATE TABLE IF NOT EXISTS guitar_presets (
    id TEXT PRIMARY KEY,
    user_id TEXT DEFAULT 'usr-demo',
    name TEXT NOT NULL,
    amp_type TEXT DEFAULT 'Tube Modern',
    gain REAL DEFAULT 0.5,
    bass REAL DEFAULT 0.5,
    mid REAL DEFAULT 0.5,
    treble REAL DEFAULT 0.5,
    pedals_json TEXT, -- JSON configuration of active pedalboard
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_guitar_tracks_cat ON guitar_tracks(category);
CREATE INDEX IF NOT EXISTS idx_guitar_tracks_diff ON guitar_tracks(difficulty);
CREATE INDEX IF NOT EXISTS idx_guitar_tabs_track ON guitar_tabs(track_id);
CREATE INDEX IF NOT EXISTS idx_guitar_presets_user ON guitar_presets(user_id);
