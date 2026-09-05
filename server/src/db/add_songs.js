import { db, dbHelper } from './database.js';

console.log('⚡ Ingesting requested songs and guitar tabs into SQLite...');

const NEW_SONGS = [
  {
    id: 'track-phir-bhi-tumko',
    title: 'Main Phir Bhi Tumko Chahunga',
    artist: 'Arijit Singh & Shashaa Tirupati',
    album: 'Half Girlfriend',
    category: 'acoustic',
    tuning: 'Standard E (Capo 1)',
    bpm: 78,
    keySignature: 'C#m',
    difficulty: 'Beginner',
    duration: 361,
    audioUrl: '/audio/track-phir-bhi-tumko.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0-2-3--2-0-----0-2-3--|',
    lyrics: `[00:15.00] Tum mere ho is pal mere ho\n[00:30.00] Kal shayad ye aalam na rahe\n[00:45.00] Main phir bhi tumko chahunga\n[01:05.00] Iss chahat mein marr jaaunga`,
    playCount: 4850000,
    tab: {
      id: 'tab-phir-bhi-tumko',
      tuning: 'Standard E (Capo on 1st Fret)',
      capo: 1,
      difficulty: 'Beginner / Intermediate',
      chords: ['Em', 'C', 'D', 'Bm', 'Am', 'G'],
      tabContent: `Key: C#m (Capo on 1st Fret)
Chords used relative to Capo: Em, C, D, Bm, G, Am
Strumming Pattern: D - D - U - U - D - U

[Intro Acoustic Fingerpicking]
e|-------0---------------0---------|-------0---------------2---------|
B|-----------0---------------1-----|-----------1---------------3-----|
G|---------------0---------------0-|---------------0---------------2-|
D|---2---------------2-------------|---2---------------0-------------|
A|-----------------3---------------|---------------------------------|
E|-0-------------------------------|-0-------------------------------|
   Em              C                 Em              D

[Verse 1]
Em               C
Tum mere ho is pal mere ho
D               Bm
Kal shayad ye aalam na rahe
Em                  C
Kuch aisa ho tum tum na raho
D                  Bm
Kuch aisa ho hum hum na rahe

[Chorus]
     Em           C
Yeh raaste milte na milte
        D            Bm
Tere dil se mera dil juda rehta
         Em            C
Main phir bhi tumko chahunga
         D             Bm
Main phir bhi tumko chahunga
       C           D          Em
Iss chahat mein marr jaaunga...`
    }
  },
  {
    id: 'track-saiyaara',
    title: 'Saiyaara',
    artist: 'Mohit Chauhan & Taraannum Mallik',
    album: 'Ek Tha Tiger',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 86,
    keySignature: 'Dm',
    difficulty: 'Intermediate',
    duration: 248,
    audioUrl: '/audio/track-saiyaara.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'B|---3-3-3--1-1---1-3-1--|',
    lyrics: `[00:12.00] Aasmaan tera mera hua\n[00:26.00] Khwaab ki tarah dhuaan dhuaan\n[00:40.00] Saiyaara main saiyaara\n[00:58.00] Saiyaara tu saiyaara`,
    playCount: 6200000,
    tab: {
      id: 'tab-saiyaara',
      tuning: 'Standard E (No Capo)',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Dm', 'C', 'Bb', 'F', 'Gm', 'A'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, F, Gm, A
Strumming Pattern: D - U - U - D - U - U - D - U

[Intro Lead Riff]
e|---------------------------------|---------------------------------|
B|-------3-1-----------------------|-------3-1-----------------------|
G|---2-2-----3-2-0---0-2-3-2-------|---2-2-----3-2-0---0-2-0---------|
D|-0---------------3---------------|-0---------------3-------3-2-0---|
A|---------------------------------|---------------------------------|
E|---------------------------------|---------------------------------|
   Dm              C                 Bb              C

[Verse 1]
Dm            C
Aasmaan tera mera hua
Bb            C
Khwaab ki tarah dhuaan dhuaan
Dm            C
Aasmaan tera mera hua
Bb             A
Saans ki tarah rawaan rawaan

[Chorus]
Dm               C
Saiyaara main saiyaara
Bb               C
Saiyaara tu saiyaara
Dm             C
Sitaaron ke jahaan mein
Bb               A
Milenge ab yaara
         Dm      C    Bb   C
Saiyaara...`
    }
  },
  {
    id: 'track-tera-mera-rishta',
    title: 'Tera Mera Rishta',
    artist: 'Mustafa Zahid (Roxen)',
    album: 'Awarapan',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 125,
    keySignature: 'Em',
    difficulty: 'Intermediate',
    duration: 313,
    audioUrl: '/audio/track-tera-mera-rishta.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---12-14-15--14-12-------|',
    lyrics: `[00:18.00] Tera mera rishta purana\n[00:32.00] Hai kisi mod pe le aana\n[00:46.00] Kyun juda hum hue\n[01:05.00] Kya khata thi meri`,
    playCount: 7890000,
    tab: {
      id: 'tab-tera-mera-rishta',
      tuning: 'Standard E (Overdrive Guitar)',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Em', 'D', 'C', 'Bm', 'Am', 'G'],
      tabContent: `Key: E Minor (Standard E Tuning - Electric Overdrive & Tape Delay)
Chords used: Em, D, C, Bm, Am, G
Strumming Pattern: D - D - U - U - D - U

[Intro Electric Lead Guitar Solo]
e|---12-12-12---14-15---14-12------|---12-12-12---14-15---17-15-14---|
B|----------------------------15---|---------------------------------|
G|---------------------------------|---------------------------------|
D|---------------------------------|---------------------------------|
A|---------------------------------|---------------------------------|
E|---------------------------------|---------------------------------|
   Em              D                 C               D

[Verse 1]
Em            D
Tera mera rishta purana
C             D
Hai kisi mod pe le aana
Em            D
Tera mera rishta purana
C             Bm
Aisa kabhi socha na tha

[Chorus]
Em            D
Kyun juda hum hue
C              D
Kya khata thi meri
Em            D
Kyun juda hum hue
C              Bm
Faasle hain darmiyaan...
Em            D          C    D
Tera mera rishta purana...`
    }
  }
];

for (const song of NEW_SONGS) {
  const artistId = `artist-${song.artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  // 1. Ensure artist exists
  const existingArtist = dbHelper.get('SELECT id FROM artists WHERE id = ?', artistId);
  if (!existingArtist) {
    dbHelper.run(`
      INSERT INTO artists (id, name, bio, image_url, verified, genre)
      VALUES (?, ?, ?, ?, 1, ?)
    `, artistId, song.artist, `Famous vocalist & guitarist: ${song.artist}`, song.coverUrl, song.category);
  }

  // 2. Insert into main tracks table
  dbHelper.run(`
    INSERT OR REPLACE INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
    VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, 2026, ?, 0, ?)
  `, song.id, song.title, artistId, song.artist, song.album, song.duration, song.audioUrl, song.coverUrl, song.category, song.playCount, song.lyrics);

  // 3. Insert into guitar_tracks table
  dbHelper.run(`
    INSERT OR REPLACE INTO guitar_tracks (id, title, artist_name, category, tuning, bpm, key_signature, difficulty, duration, audio_url, cover_url, tab_preview, lyrics, play_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, song.id, song.title, song.artist, song.category, song.tuning, song.bpm, song.keySignature, song.difficulty, song.duration, song.audioUrl, song.coverUrl, song.tabPreview, song.lyrics, song.playCount);

  // 4. Insert into guitar_tabs table
  dbHelper.run(`
    INSERT OR REPLACE INTO guitar_tabs (id, track_id, title, artist, tuning, capo, difficulty, tab_content, chords_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, song.tab.id, song.id, `${song.title} Tab & Chords`, song.artist, song.tab.tuning, song.tab.capo, song.tab.difficulty, song.tab.tabContent, JSON.stringify(song.tab.chords));
}

console.log('✅ All 3 songs and guitar chords/tabs successfully ingested into database!');
