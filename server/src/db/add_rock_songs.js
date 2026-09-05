import { db, dbHelper } from './database.js';

console.log('⚡ Ingesting Aadat, Toh Phir Aao, Yeh Awarapan, Naadan Parindey, Bulleya into SQLite...');

const ROCK_SONGS = [
  {
    id: 'track-aadat',
    title: 'Aadat',
    artist: 'Atif Aslam / Jal',
    album: 'Aadat / Kalyug',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 92,
    keySignature: 'Am',
    difficulty: 'Intermediate',
    duration: 334,
    audioUrl: '/audio/track-aadat.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------0-----------0-------|',
    lyrics: `[00:15.00] Judaa hoke bhi tu mujhmein kahin baaki hai\n[00:32.00] Palkon mein banke aansu tu chali aati hai\n[00:48.00] Kaise jiyein hum tere bin\n[01:05.00] Ab toh aadat si hai mujhko aise jeene mein`,
    playCount: 16500000,
    tab: {
      id: 'tab-aadat',
      tuning: 'Standard E (Capo 0)',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Am', 'F', 'G', 'Em', 'C', 'Dm'],
      tabContent: `Key: A Minor (Standard E Tuning)
Chords used: Am, F, G, Em, C, Dm
Strumming Pattern: D - D - U - U - D - U (Emotional Alt-Rock Arpeggio)

[Intro Iconic Fingerpicking Riff]
e|---------------------------------|---------------------------------|
B|-------1---------------1---------|-------0---------------0---------|
G|---2-------2-------2-------2-----|---0-------0-------0-------0-----|
D|-2---2-------2---3---3-------3---|-0---0-------0---2---2-------2---|
A|---------------------------------|---------------------------------|
E|---------------------------------|---------------------------------|
   Am              F                 G               Em

[Verse 1]
Am               F
Judaa hoke bhi tu mujhmein kahin baaki hai
G                Em
Palkon mein banke aansu tu chali aati hai
Am               F
Judaa hoke bhi tu mujhmein kahin baaki hai
G                Em
Palkon mein banke aansu tu chali aati hai

[Chorus]
Am      F         G         Em
Kaise jiyein hum tere bin...
Am      F         G         Em
Kaise jiyein hum tere bin...
Am            F
Ab toh aadat si hai mujhko
G             Em
Aise jeene mein...
Am            F
Heeyyy... aaaaa...
G             Em
Aise jeene mein!`
    }
  },
  {
    id: 'track-toh-phir-aao',
    title: 'Toh Phir Aao',
    artist: 'Mustafa Zahid (Roxen)',
    album: 'Awarapan',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 118,
    keySignature: 'Em',
    difficulty: 'Intermediate',
    duration: 339,
    audioUrl: '/audio/track-toh-phir-aao.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---7-8-7---5-7-5---|',
    lyrics: `[00:20.00] Toh phir aao mujhko satao\n[00:38.00] Toh phir aao mujhko rulao\n[00:55.00] Dil badal bana aankhein behne lagi\n[01:15.00] Aahhein aisi uthi jaise aandhi chali`,
    playCount: 14200000,
    tab: {
      id: 'tab-toh-phir-aao',
      tuning: 'Standard E (Electric Distortion / Clean Intro)',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Em', 'D', 'C', 'Bm', 'Am', 'G'],
      tabContent: `Key: E Minor (Standard E Tuning)
Chords used: Em, D, C, Bm, Am, G
Strumming Pattern: D - D - U - U - D - U (Power ballad slow build into heavy distortion)

[Intro Lead Guitar Melodic Theme]
e|---7-8-7---5-7-5---3-5-3---2-3-2-|---0-----------------------------|
B|---------------------------------|-------3---1---0-----------------|
G|---------------------------------|-------------------2---0---------|
D|---------------------------------|---------------------------2-----|
A|---------------------------------|---------------------------------|
E|---------------------------------|---------------------------------|
   Em          D       C       Bm      Em

[Chorus]
Em               D
Toh phir aao mujhko satao
C                D
Toh phir aao mujhko rulao
Em               D
Toh phir aao mujhko satao
C                D
Toh phir aao mujhko rulao

[Verse 1]
Em
Dil badal bana
D
Aankhein behne lagi
C
Aahhein aisi uthi
D
Jaise aandhi chali
Em             D
Toh phir aao... mujhko satao...
C              D            Em
Toh phir aao... mujhko rulao...`
    }
  },
  {
    id: 'track-yeh-awarapan',
    title: 'Yeh Awarapan',
    artist: 'KK',
    album: 'Jism',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 76,
    keySignature: 'Dm',
    difficulty: 'Intermediate',
    duration: 400,
    audioUrl: '/audio/track-yeh-awarapan.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------1-----------1-------|',
    lyrics: `[00:25.00] Awarapan banjarpan ek khala hai seene mein\n[00:45.00] Har pal koi daud raha hai ek dhuen ke jeene mein\n[01:10.00] Phirta rehta hai pagal sa ban ke hawa ka ek jhonka\n[01:30.00] Kismat ki deewaron par lagta hai sar patakne`,
    playCount: 11300000,
    tab: {
      id: 'tab-yeh-awarapan',
      tuning: 'Standard E (Spanish Nylon & Steel Strings)',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Dm', 'C', 'Bb', 'A', 'Gm'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, A, Gm
Strumming Pattern: D - U - U - D - U (Slow haunting acoustic ballad)

[Intro Spanish Classical Fingerpicking]
e|-------1---------------0---------|---------------------------------|
B|-----------3---------------1-----|-------3---------------2---------|
G|---2-----------2---0-----------0-|-----------3---------------2-----|
D|-0---0-----------2---2-----------|---3-----------3---2-----------2-|
A|---------------------------------|-1---1-----------0---0-----------|
E|---------------------------------|---------------------------------|
   Dm              C                 Bb              A

[Verse 1]
Dm            C
Awarapan banjarpan
Bb               A
Ek khala hai seene mein
Dm            C
Awarapan banjarpan
Bb               A
Ek khala hai seene mein
Gm            C
Har pal koi daud raha hai
Bb               A
Ek dhuen ke jeene mein

[Chorus]
Dm            C
Awarapan banjarpan
Bb               A        Dm
Ek khala hai seene mein...`
    }
  },
  {
    id: 'track-naadan-parindey',
    title: 'Naadan Parindey',
    artist: 'A.R. Rahman & Mohit Chauhan',
    album: 'Rockstar',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 128,
    keySignature: 'Dm',
    difficulty: 'Advanced',
    duration: 402,
    audioUrl: '/audio/track-naadan-parindey.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-----10-8-------------------|',
    lyrics: `[00:15.00] O naadaan parindey ghar aaja\n[00:32.00] Kyun des bides phire maara\n[00:50.00] Nadaan parindey ghar aaja\n[01:10.00] Kaaga re kaaga re mori itni araz tose`,
    playCount: 19800000,
    tab: {
      id: 'tab-naadan-parindey',
      tuning: 'Standard E (Acoustic Rhythm & Overdriven Stadium Solos)',
      capo: 0,
      difficulty: 'Advanced',
      chords: ['Dm', 'C', 'Bb', 'F', 'Am', 'Gm', 'A'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, F, Am, Gm, A
Strumming Pattern: D - D - U - U - D - U (Intense driving rock pulse)

[Iconic Opening Acoustic Riff]
e|---------------------------------|---------------------------------|
B|-------10-8----------------------|-------10-8----------------------|
G|---7-7------10-9-7---7-9-10-9-7--|---7-7------10-9-7---7-9-7-------|
D|-0-----------------10----------10|-0-----------------10------10-8-7|
A|---------------------------------|---------------------------------|
E|---------------------------------|---------------------------------|
   Dm              C                 Dm              Bb

[Chorus]
Dm
O naadaan parindey ghar aaja
C
Ghar aaja, ghar aaja, ghar aaja
Bb              A
Kyun des bides phire maara
Dm
Nadaan parindey ghar aaja

[Verse 1 - Soulful Breakdown]
Dm               C
Kaaga re kaaga re mori itni araz tose
Bb               A
Chun chun khaiyo maans
Dm               C
Araziya re khaiyo na tu naina more
Bb               A
Piya ke milan ki aas...

[Rock Climax Shred Riff]
e|---10-12-13-12-10----10-12-13-15-13-12-10---|
B|------------------13-------------------------|
G|---------------------------------------------|
D|---------------------------------------------|`
    }
  },
  {
    id: 'track-bulleya',
    title: 'Bulleya',
    artist: 'Amit Mishra & Shilpa Rao',
    album: 'Ae Dil Hai Mushkil',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 110,
    keySignature: 'Dm',
    difficulty: 'Intermediate / Advanced',
    duration: 348,
    audioUrl: '/audio/track-bulleya.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'D|---0-0-12-10-8-7-8-7-5---|',
    lyrics: `[00:15.00] Meri rooh ka parinda phadphadaye\n[00:30.00] Lekin sukoon ka jazeera mil na paaye\n[00:45.00] Ve ki karaan, ve ki karaan\n[01:00.00] Ranjhana ve, ranjhana ve\n[01:15.00] Bulleya ki jaana main kaun`,
    playCount: 17400000,
    tab: {
      id: 'tab-bulleya',
      tuning: 'Standard E (Grunge Distortion & Alt-Rock Drive)',
      capo: 0,
      difficulty: 'Intermediate / Advanced',
      chords: ['Dm', 'C', 'Bb', 'F', 'Gm', 'A'],
      tabContent: `Key: D Minor (Standard E Tuning - Heavy Distortion)
Chords used: Dm, C, Bb, F, Gm, A
Strumming Pattern: D - D - D - U - D - U (Driving modern hard rock grunge)

[Iconic Grunge Intro Electric Riff]
e|---------------------------------|---------------------------------|
B|---------------------------------|---------------------------------|
G|---------------------------------|---------------------------------|
D|---0-0-12-10-8-7-8-7-5-7-5-3-0---|---0-0-12-10-8-7-8-10-12-10-8-7--|
A|---------------------------------|---------------------------------|
E|---------------------------------|---------------------------------|
   Dm              Bb                C               A

[Verse 1]
Dm
Meri rooh ka parinda phadphadaye
Bb
Lekin sukoon ka jazeera mil na paaye
C
Ve ki karaan, ve ki karaan
A
Ek baar ko tajalli toh dikha de
Dm
Jhoothi sahi magar tasalli toh dila de

[Chorus]
Dm
Ranjhana ve! Ranjhana ve!
Bb
Kuchh nasha hai teri yaari mein
C
Ranjhana ve!
Dm       Bb      C        A
Bulleya... aa... aa...
Dm       Bb      C        A
Bulleya ki jaana main kaun!`
    }
  }
];

for (const s of ROCK_SONGS) {
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

  // Insert into tracks
  dbHelper.run(`
    INSERT OR REPLACE INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, s.id, s.title, artistId, s.artist, albumId, s.album, s.duration, s.audioUrl, s.coverUrl, s.category, 2026, s.playCount, 0, s.lyrics);

  // Insert into guitar_tracks
  dbHelper.run(`
    INSERT OR REPLACE INTO guitar_tracks (id, title, artist_name, category, tuning, bpm, key_signature, difficulty, duration, audio_url, cover_url, tab_preview, lyrics, play_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, s.id, s.title, s.artist, s.category, s.tuning, s.bpm, s.keySignature, s.difficulty, s.duration, s.audioUrl, s.coverUrl, s.tabPreview, s.lyrics, s.playCount);

  // Insert into guitar_tabs
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

console.log('✅ Successfully ingested Aadat, Toh Phir Aao, Yeh Awarapan, Naadan Parindey, Bulleya into SQLite!');
