import { db, dbHelper } from './database.js';

console.log('⚡ Ingesting Cold, Feels, Counting Stars and guitar tabs into SQLite...');

const SONGS = [
  {
    id: 'track-cold',
    title: 'Cold',
    artist: 'Maroon 5 ft. Future',
    album: 'Red Pill Blues',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 100,
    keySignature: 'Am',
    difficulty: 'Beginner',
    duration: 229,
    audioUrl: '/audio/track-cold.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0---1---0---3---|',
    lyrics: `[00:10.00] Cold enough to chill my bones\n[00:22.00] It feels like I don't know you anymore\n[00:35.00] I don't understand why you're so cold\n[00:50.00] Are we taking time or a time out?`,
    playCount: 9450000,
    tab: {
      id: 'tab-cold',
      tuning: 'Standard E (No Capo)',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['Am', 'F', 'C', 'G', 'Dm'],
      tabContent: `Key: A Minor (Standard E Tuning)
Chords used: Am, F, C, G, Dm
Strumming Pattern: D - D - U - U - D - U (Chill R&B pop groove)

[Intro Riff]
e|-------0---------------1---------|-------0---------------3---------|
B|-----------1---------------1-----|-----------1---------------0-----|
G|---2-----------2---2-----------2-|---0-----------0---0-----------0-|
D|-2---2-----------3---3-----------|---------------------------------|
A|---------------------------------|-3---3-----------2---2-----------|
E|---------------------------------|---------------------------------|
   Am              F                 C               G

[Verse 1]
Am                     F
Cold enough to chill my bones
                       C
It feels like I don't know you anymore
                      G
I don't understand why you're so cold to me
Am                         F
With your touch like ice and a stare so dead
           C                     G
Got me sitting all alone on the edge of the bed

[Chorus]
Am                       F
Are we taking time or a time out?
             C                       G
I didn't mean to wake up with your cold heart
             Am                      F
Why you're so cold, why you're so cold
             C                       G
Why you're so cold, cold, cold to me`
    }
  },
  {
    id: 'track-feels',
    title: 'Feels',
    artist: 'Calvin Harris ft. Pharrell, Katy Perry & Big Sean',
    album: 'Funk Wav Bounces Vol. 1',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 103,
    keySignature: 'Bm',
    difficulty: 'Intermediate',
    duration: 223,
    audioUrl: '/audio/track-feels.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---7---7---7---9---|',
    lyrics: `[00:15.00] Don't be afraid to catch feels\n[00:30.00] Ride drop top and chase thrills\n[00:45.00] I know you ain't afraid to pop pills\n[01:00.00] Baby I know you ain't scared to catch feels`,
    playCount: 12800000,
    tab: {
      id: 'tab-feels',
      tuning: 'Standard E (Funky Pop / Disco Chops)',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Bm', 'Em', 'A', 'D', 'G'],
      tabContent: `Key: B Minor (Standard E Tuning)
Chords used: Bm, Em, A, D, G
Strumming Pattern: Staccato Reggae Skank / Funk Chop on beats 2 and 4 (x - D - x - D)

[Funky Rhythm Guitar Skank]
e|---7---7---7---7---|---7---7---7---7---|---5---5---5---5---|---5---5---5---5---|
B|---7---7---7---7---|---8---8---8---8---|---5---5---5---5---|---7---7---7---7---|
G|---7---7---7---7---|---9---9---9---9---|---6---6---6---6---|---7---7---7---7---|
D|-------------------|-------------------|-------------------|-------------------|
A|-------------------|-------------------|-------------------|-------------------|
E|-------------------|-------------------|-------------------|-------------------|
   Bm                  Em                  A                   D

[Chorus - Pharrell Williams & Katy Perry]
Bm               Em
Don't be afraid to catch feels
A                    D
Ride drop top and chase thrills (Hey!)
Bm                    Em
I know you ain't afraid to pop pills
A                   D
Baby, I know you ain't scared to catch feels
G              Bm
Feels with me!`
    }
  },
  {
    id: 'track-counting-stars',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    album: 'Native',
    category: 'acoustic',
    tuning: 'Standard E (Capo 4)',
    bpm: 122,
    keySignature: 'C#m',
    difficulty: 'Beginner / Intermediate',
    duration: 283,
    audioUrl: '/audio/track-counting-stars.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------0---------------0---|',
    lyrics: `[00:08.00] Lately I've been, I've been losing sleep\n[00:20.00] Dreaming about the things that we could be\n[00:32.00] But baby I've been, I've been praying hard\n[00:44.00] Said no more counting dollars, we'll be counting stars`,
    playCount: 18900000,
    tab: {
      id: 'tab-counting-stars',
      tuning: 'Standard E (Capo 4th Fret)',
      capo: 4,
      difficulty: 'Beginner / Intermediate',
      chords: ['Am', 'C', 'G', 'F', 'Dm'],
      tabContent: `Key: C# Minor (Capo on 4th Fret, chords relative to Capo: Am, C, G, F)
Strumming Pattern: D - D - U - U - D - U (Acoustic Folk Driving Pulse)

[Intro Acoustic Fingerpicking / Strum]
e|-------0---------------0---------|-------3---------------1---------|
B|-----------1---------------1-----|-----------0---------------1-----|
G|---2-----------2---0-----------0-|---0-----------0---2-----------2-|
D|---------------------------------|-----------------3---3-----------|
A|-0---0-----------3---3-----------|---------------------------------|
E|---------------------------------|-3---3---------------------------|
   Am              C                 G               F

[Intro / Chorus]
Am
Lately, I've been, I've been losing sleep
C
Dreaming about the things that we could be
    G
But baby, I've been, I've been praying hard
F
Said, no more counting dollars, we'll be counting stars
Am
Yeah, we'll be counting stars!

[Verse 1]
Am
I see this life like a swinging vine
C
Swing my heart across the line
G
In my face is flashing signs
F
Seek it out and ye shall find`
    }
  }
];

// Helper to create artist if needed
for (const s of SONGS) {
  const artistId = `artist-${s.artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const albumId = `album-${s.album.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  dbHelper.run(`
    INSERT OR IGNORE INTO artists (id, name, bio, image_url, genre, monthly_listeners)
    VALUES (?, ?, ?, ?, ?, ?)
  `, artistId, s.artist, `${s.artist} on Resonance`, s.coverUrl, s.category, s.playCount);

  dbHelper.run(`
    INSERT OR IGNORE INTO albums (id, title, artist_id, release_year, cover_url, genre)
    VALUES (?, ?, ?, ?, ?, ?)
  `, albumId, s.album, artistId, 2026, s.coverUrl, s.category);

  // Insert or replace in tracks
  dbHelper.run(`
    INSERT OR REPLACE INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, s.id, s.title, artistId, s.artist, albumId, s.album, s.duration, s.audioUrl, s.coverUrl, s.category, 2026, s.playCount, 0, s.lyrics);

  // Insert or replace in guitar_tracks
  dbHelper.run(`
    INSERT OR REPLACE INTO guitar_tracks (id, title, artist_name, category, tuning, bpm, key_signature, difficulty, duration, audio_url, cover_url, tab_preview, lyrics, play_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, s.id, s.title, s.artist, s.category, s.tuning, s.bpm, s.keySignature, s.difficulty, s.duration, s.audioUrl, s.coverUrl, s.tabPreview, s.lyrics, s.playCount);

  // Insert guitar tab
  dbHelper.run(`
    INSERT OR REPLACE INTO guitar_tabs (id, track_id, title, artist, tuning, capo, difficulty, chords_json, tab_content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, s.tab.id, s.id, s.title, s.artist, s.tab.tuning, s.tab.capo, s.tab.difficulty, JSON.stringify(s.tab.chords), s.tab.tabContent);

  // Mark liked for demo user
  dbHelper.run(`
    INSERT OR IGNORE INTO liked_songs (user_id, track_id)
    VALUES (?, ?)
  `, 'usr-demo', s.id);
}

console.log('✅ Successfully ingested Cold, Feels, and Counting Stars into SQLite!');
