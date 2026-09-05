import { db, dbHelper } from './database.js';

console.log('⚡ Ingesting 15 Bollywood 2010 hits and guitar tabs into SQLite...');

const BOLLYWOOD_SONGS = [
  {
    id: 'track-tera-hone-laga-hoon',
    title: 'Tera Hone Laga Hoon',
    artist: 'Atif Aslam & Alisha Chinai',
    album: 'Ajab Prem Ki Ghazab Kahani',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 96,
    keySignature: 'G',
    difficulty: 'Beginner',
    duration: 300,
    audioUrl: '/audio/track-tera-hone-laga-hoon.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---3---2---0---2---|',
    lyrics: `[00:15.00] Shining in the setting sun like a pearl upon the ocean\n[00:30.00] Come on heal me\n[00:45.00] Hua jo tu bhi mera mera\n[01:05.00] Tera hone laga hoon khone laga hoon`,
    playCount: 18500000,
    tab: {
      id: 'tab-tera-hone-laga-hoon',
      tuning: 'Standard E (No Capo)',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['G', 'Em', 'C', 'D', 'Am'],
      tabContent: `Key: G Major (Standard E Tuning)
Chords used: G, Em, C, D, Am
Strumming Pattern: D - D - U - U - D - U

[Intro Acoustic Riff]
e|-------3---------------0---------|-------0---------------2---------|
B|-----------0---------------0-----|-----------1---------------3-----|
G|---0-----------0---0-----------0-|---0-----------0---2-----------2-|
D|-----------------2---2-----------|-----------------0---0-----------|
A|---------------------------------|-3---3---------------------------|
E|-3---3---------------------------|---------------------------------|
   G               Em                C               D

[Chorus]
G               Em
Hua jo tu bhi mera mera
C             D
Tera jo ikraar hua
G             Em
Tera hone laga hoon khone laga hoon
C              D
Jab se mila hai tera sahara`
    }
  },
  {
    id: 'track-pee-loon',
    title: 'Pee Loon',
    artist: 'Mohit Chauhan',
    album: 'Once Upon a Time in Mumbaai',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 88,
    keySignature: 'G',
    difficulty: 'Intermediate',
    duration: 288,
    audioUrl: '/audio/track-pee-loon.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------3-----------2-------|',
    lyrics: `[00:18.00] Pee loon tere neele neele naino se shabnam\n[00:36.00] Pee loon tere geeli geeli hothon ki sargam\n[00:55.00] Tere sang ishq taari hai\n[01:15.00] Tere sang ik khumari hai`,
    playCount: 22400000,
    tab: {
      id: 'tab-pee-loon',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['G', 'D', 'C', 'Em', 'Am'],
      tabContent: `Key: G Major (Standard E Tuning)
Chords used: G, D, C, Em, Am
Strumming Pattern: D - U - U - D - U (Sufi acoustic sway)

[Intro Acoustic Fingerpicking]
e|-------3---------------2---------|-------0---------------0---------|
B|-----------0---------------3-----|-----------1---------------0-----|
G|---0-----------0---2-----------2-|---0-----------0---0-----------0-|
D|-----------------0---0-----------|-----------------2---2-----------|
A|---------------------------------|-3---3---------------------------|
E|-3---3---------------------------|---------------------------------|
   G               D                 C               Em

[Verse 1]
G
Pee loon tere neele neele
D
Naino se shabnam
C
Pee loon tere geeli geeli
Em            D
Hothon ki sargam
G
Pee loon hai peene ka mausam`
    }
  },
  {
    id: 'track-sheila-ki-jawani',
    title: 'Sheila Ki Jawani',
    artist: 'Sunidhi Chauhan & Vishal Dadlani',
    album: 'Tees Maar Khan',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 128,
    keySignature: 'Dm',
    difficulty: 'Intermediate',
    duration: 283,
    audioUrl: '/audio/track-sheila-ki-jawani.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---5-5-5---6-5-3---|',
    lyrics: `[00:12.00] My name is Sheila, Sheila ki jawani\n[00:25.00] I'm too sexy for you\n[00:40.00] Main tere haath na aani`,
    playCount: 29000000,
    tab: {
      id: 'tab-sheila-ki-jawani',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner / Intermediate',
      chords: ['Dm', 'C', 'Bb', 'A'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, A
Strumming Pattern: D - D - D - U - D - U (Driving dance beat)`
    }
  },
  {
    id: 'track-munni-badnaam',
    title: 'Munni Badnaam Hui',
    artist: 'Mamta Sharma & Aishwarya Nigam',
    album: 'Dabangg',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 132,
    keySignature: 'Dm',
    difficulty: 'Beginner',
    duration: 307,
    audioUrl: '/audio/track-munni-badnaam.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---1-1-1---3-1-0---|',
    lyrics: `[00:15.00] Munni badnaam hui darling tere liye\n[00:30.00] Munni ke gaal gulabi, nain sharabi, chaal nawabi re`,
    playCount: 27500000,
    tab: {
      id: 'tab-munni-badnaam',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['Dm', 'C', 'Bb', 'A'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, A
Strumming Pattern: D - U - D - U (Upbeat desi groove)`
    }
  },
  {
    id: 'track-tere-mast-mast',
    title: 'Tere Mast Mast Do Nain',
    artist: 'Rahat Fateh Ali Khan & Shreya Ghoshal',
    album: 'Dabangg',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 90,
    keySignature: 'Dm',
    difficulty: 'Intermediate',
    duration: 359,
    audioUrl: '/audio/track-tere-mast-mast.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---5-3-1-0---1-3---|',
    lyrics: `[00:15.00] Tere mast mast do nain mere dil ka le gaye chain\n[00:35.00] Kab se hai dil bechain tere mast mast do nain`,
    playCount: 31000000,
    tab: {
      id: 'tab-tere-mast-mast',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Dm', 'C', 'Bb', 'F', 'Gm', 'A'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, F, Gm, A
Strumming Pattern: D - D - U - U - D - U (Sufi romantic waltz)`
    }
  },
  {
    id: 'track-dil-kyun-yeh-mera',
    title: 'Dil Kyun Yeh Mera',
    artist: 'KK',
    album: 'Kites',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 80,
    keySignature: 'C',
    difficulty: 'Intermediate',
    duration: 335,
    audioUrl: '/audio/track-dil-kyun-yeh-mera.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------0---------------0---|',
    lyrics: `[00:20.00] Dil kyun yeh mera shor kare\n[00:38.00] Idhar nahi udhar nahi teri or chale\n[00:55.00] Zara sa jhoom loon main\n[01:12.00] Baahon mein thaam loon main`,
    playCount: 19500000,
    tab: {
      id: 'tab-dil-kyun-yeh-mera',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['C', 'Am', 'F', 'G', 'Em'],
      tabContent: `Key: C Major (Standard E Tuning)
Chords used: C, Am, F, G, Em
Strumming Pattern: D - D - U - U - D - U

[Intro Acoustic Riff]
e|-------0---------------0---------|-------1---------------3---------|
B|-----------1---------------1-----|-----------1---------------0-----|
G|---0-----------0---2-----------2-|---2-----------2---0-----------0-|
D|-----------------2---2-----------|-3---3---------------------------|
A|-3---3---------------------------|---------------------------------|
E|---------------------------------|-----------------3---3-----------|
   C               Am                F               G

[Verse 1]
C             Am
Dil kyun yeh mera shor kare
F             G
Idhar nahi udhar nahi teri or chale
C             Am
Zara sa jhoom loon main
F             G
Baahon mein thaam loon main`
    }
  },
  {
    id: 'track-aadha-ishq',
    title: 'Aadha Ishq',
    artist: 'Shreya Ghoshal & Natalie Di Luccio',
    album: 'Band Baaja Baaraat',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 84,
    keySignature: 'G',
    difficulty: 'Beginner / Intermediate',
    duration: 284,
    audioUrl: '/audio/track-aadha-ishq.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---3---0---2---|',
    lyrics: `[00:15.00] Aadha ishq aadha hai aadha ho jayega\n[00:32.00] Kadmon ko sambhale nazrein churaaye`,
    playCount: 13800000,
    tab: {
      id: 'tab-aadha-ishq',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['G', 'Em', 'C', 'D', 'Bm'],
      tabContent: `Key: G Major (Standard E Tuning)
Chords used: G, Em, C, D, Bm
Strumming Pattern: D - D - U - U - D - U`
    }
  },
  {
    id: 'track-bin-tere',
    title: 'Bin Tere',
    artist: 'Shafqat Amanat Ali & Sunidhi Chauhan',
    album: 'I Hate Luv Storys',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 82,
    keySignature: 'Am',
    difficulty: 'Intermediate',
    duration: 330,
    audioUrl: '/audio/track-bin-tere.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------0-----------0-------|',
    lyrics: `[00:20.00] Bin tere kya hai jeena, bin tere kya hai jeena\n[00:40.00] Teri yaadon se doori nahi hai manzoor\n[01:00.00] Bin tere kya hai jeena`,
    playCount: 21500000,
    tab: {
      id: 'tab-bin-tere',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Am', 'F', 'C', 'G', 'Dm', 'Em'],
      tabContent: `Key: A Minor (Standard E Tuning)
Chords used: Am, F, C, G, Dm, Em
Strumming Pattern: D - D - U - U - D - U (Melodic Sufi ballad)

[Intro Acoustic Fingerpicking]
e|-------0---------------1---------|-------0---------------3---------|
B|-----------1---------------1-----|-----------1---------------0-----|
G|---2-----------2---2-----------2-|---0-----------0---0-----------0-|
D|-2---2-----------3---3-----------|---------------------------------|
A|---------------------------------|-3---3-----------2---2-----------|
E|---------------------------------|---------------------------------|
   Am              F                 C               G

[Chorus]
Am
Bin tere... bin tere...
F
Kya hai jeena...
C
Bin tere... bin tere...
G
Kya hai marna...`
    }
  },
  {
    id: 'track-sadka-kiya',
    title: 'Sadka Kiya',
    artist: 'Shaan & Mahalakshmi Iyer',
    album: 'I Hate Luv Storys',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 98,
    keySignature: 'E',
    difficulty: 'Intermediate',
    duration: 342,
    audioUrl: '/audio/track-sadka-kiya.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0-0-0---2-4-2---|',
    lyrics: `[00:15.00] Sadka kiya ye ishq ka sajda kiya\n[00:30.00] Maine to khuda se bas tujhko maang liya`,
    playCount: 14700000,
    tab: {
      id: 'tab-sadka-kiya',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['E', 'A', 'B', 'C#m'],
      tabContent: `Key: E Major (Standard E Tuning)
Chords used: E, A, B, C#m
Strumming Pattern: D - D - U - U - D - U`
    }
  },
  {
    id: 'track-ihls-title',
    title: 'I Hate Luv Storys',
    artist: 'Vishal Dadlani',
    album: 'I Hate Luv Storys',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 126,
    keySignature: 'Dm',
    difficulty: 'Beginner',
    duration: 285,
    audioUrl: '/audio/track-ihls-title.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---5---5---6---5---|',
    lyrics: `[00:10.00] I hate luv storys, I hate luv storys\n[00:25.00] Pyaar vyaar sab dhokha hai`,
    playCount: 16200000,
    tab: {
      id: 'tab-ihls-title',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['Dm', 'C', 'Bb', 'F'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, F
Strumming Pattern: D - D - U - D - U (Energetic Pop Dance)`
    }
  },
  {
    id: 'track-zindagi-do-pal-ki',
    title: 'Zindagi Do Pal Ki',
    artist: 'KK',
    album: 'Kites',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 84,
    keySignature: 'Dm',
    difficulty: 'Intermediate',
    duration: 254,
    audioUrl: '/audio/track-zindagi-do-pal-ki.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------1-----------1-------|',
    lyrics: `[00:15.00] Zindagi do pal ki zindagi do pal ki\n[00:32.00] Intezaar kab tak hum karenge bhala`,
    playCount: 17800000,
    tab: {
      id: 'tab-zindagi-do-pal-ki',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Dm', 'C', 'Bb', 'F', 'Am'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, F, Am
Strumming Pattern: D - D - U - U - D - U (Spanish acoustic ballad)`
    }
  },
  {
    id: 'track-chori-kiya-re-jiya',
    title: 'Chori Kiya Re Jiya',
    artist: 'Sonu Nigam & Shreya Ghoshal',
    album: 'Dabangg',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 92,
    keySignature: 'F',
    difficulty: 'Beginner',
    duration: 288,
    audioUrl: '/audio/track-chori-kiya-re-jiya.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---1---0---1---|',
    lyrics: `[00:15.00] Chori kiya re jiya mora jiya\n[00:30.00] O re piya gupchup chori se`,
    playCount: 18900000,
    tab: {
      id: 'tab-chori-kiya-re-jiya',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['F', 'Bb', 'C', 'Dm'],
      tabContent: `Key: F Major (Standard E Tuning)
Chords used: F, Bb, C, Dm
Strumming Pattern: D - D - U - U - D - U`
    }
  },
  {
    id: 'track-sajde',
    title: 'Sajde',
    artist: 'KK & Sunidhi Chauhan',
    album: 'Khatta Meetha',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 95,
    keySignature: 'Em',
    difficulty: 'Intermediate',
    duration: 308,
    audioUrl: '/audio/track-sajde.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0-2-3---2-0---|',
    lyrics: `[00:18.00] Sajde kiye hain laakhon, laakhon duayein maangi\n[00:36.00] Paaya hai maine phir tujhko`,
    playCount: 23100000,
    tab: {
      id: 'tab-sajde',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Em', 'D', 'C', 'G', 'Am'],
      tabContent: `Key: E Minor (Standard E Tuning)
Chords used: Em, D, C, G, Am
Strumming Pattern: D - D - U - U - D - U (Rock Ballad)`
    }
  },
  {
    id: 'track-aapka-kya-hoga-dhanno',
    title: 'Aapka Kya Hoga (Dhanno)',
    artist: 'Mika Singh, Sunidhi Chauhan & Sajid Khan',
    album: 'Housefull',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 130,
    keySignature: 'Em',
    difficulty: 'Beginner',
    duration: 310,
    audioUrl: '/audio/track-aapka-kya-hoga-dhanno.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0-0-0---3-2-0---|',
    lyrics: `[00:15.00] Aapka kya hoga janabe ali\n[00:30.00] Apni to jaise taise thodi aise ya waise kat jaayegi`,
    playCount: 26400000,
    tab: {
      id: 'tab-aapka-kya-hoga-dhanno',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['Em', 'G', 'D', 'C'],
      tabContent: `Key: E Minor (Standard E Tuning)
Chords used: Em, G, D, C
Strumming Pattern: D - D - D - U - D - U (High-tempo party)`
    }
  },
  {
    id: 'track-ainvayi-ainvayi',
    title: 'Ainvayi Ainvayi',
    artist: 'Salim Merchant & Sunidhi Chauhan',
    album: 'Band Baaja Baaraat',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 136,
    keySignature: 'Dm',
    difficulty: 'Beginner',
    duration: 265,
    audioUrl: '/audio/track-ainvayi-ainvayi.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---5-5-5---6-5-3---|',
    lyrics: `[00:15.00] Ainvayi ainvayi ainvayi lut gaya\n[00:30.00] Baazi ishq ki baazi main jeet gaya`,
    playCount: 28200000,
    tab: {
      id: 'tab-ainvayi-ainvayi',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['Dm', 'C', 'Bb', 'F'],
      tabContent: `Key: D Minor (Standard E Tuning)
Chords used: Dm, C, Bb, F
Strumming Pattern: D - U - D - U (High energy bhangra/pop)`
    }
  }
];

for (const s of BOLLYWOOD_SONGS) {
  const artistId = `artist-${s.artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const albumId = `album-${s.album.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  dbHelper.run(`
    INSERT OR IGNORE INTO artists (id, name, bio, image_url, genre, monthly_listeners)
    VALUES (?, ?, ?, ?, ?, ?)
  `, artistId, s.artist, `${s.artist} on Resonance`, s.coverUrl, s.category, s.playCount);

  dbHelper.run(`
    INSERT OR IGNORE INTO albums (id, title, artist_id, release_year, cover_url, genre)
    VALUES (?, ?, ?, ?, ?, ?)
  `, albumId, s.album, artistId, 2010, s.coverUrl, s.category);

  // Insert into tracks
  dbHelper.run(`
    INSERT OR REPLACE INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, s.id, s.title, artistId, s.artist, albumId, s.album, s.duration, s.audioUrl, s.coverUrl, s.category, 2010, s.playCount, 0, s.lyrics);

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
}

console.log('✅ Successfully ingested 15 Bollywood 2010 songs into SQLite!');
