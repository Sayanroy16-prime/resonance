import { db, dbHelper } from './database.js';

console.log('⚡ Ingesting 12 New Genre Anthem tracks into SQLite database...');

const NEW_ANTHEM_SONGS = [
  // ── POP ──
  {
    id: 'track-subah-hone-na-de',
    title: 'Subah Hone Na De',
    artist: 'Mika Singh, Shefali Alvares',
    album: 'Desi Boyz',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 128,
    keySignature: 'F#m',
    difficulty: 'Intermediate',
    duration: 288,
    audioUrl: '/audio/track-subah-hone-na-de.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---2---4---5---4---|',
    lyrics: `[00:15.00] Humse bachke jaayega kahan\n[00:25.00] Apne aaju baaju dekh le zaroor\n[00:40.00] Subah hone na de, hosh khone na de\n[01:00.00] Ek doosre ko hum sone na de`,
    playCount: 16500000,
    tab: {
      id: 'tab-subah-hone-na-de',
      tuning: 'Standard E',
      capo: 2,
      difficulty: 'Intermediate',
      chords: ['Em', 'D', 'C', 'B7'],
      tabContent: `Capo: 2nd Fret (Chords relative to Capo: Em, D, C, B7)
Tempo: 128 BPM | Dance Pop Funk Groove
Strumming: D - D - U - U - D - U (Muted funk chops)

[Chorus]
Em               D
Subah hone na de, hosh khone na de
C                  B7
Ek doosre ko hum sone na de
Em                 D
Kyunki abhi toh party shuru hui hai
C                  B7
Subah hone na de, hosh khone na de`
    }
  },
  {
    id: 'track-badtameez-dil',
    title: 'Badtameez Dil',
    artist: 'Benny Dayal, Shefali Alvares',
    album: 'Yeh Jawaani Hai Deewani',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 144,
    keySignature: 'Fm',
    difficulty: 'Intermediate',
    duration: 252,
    audioUrl: '/audio/track-badtameez-dil.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---8---8---8---8---|',
    lyrics: `[00:12.00] Paan main pudeena dekha\n[00:24.00] Naak ka nageena dekha\n[00:40.00] Badtameez dil maane na maane na\n[01:00.00] Badtameez dil, badtameez dil`,
    playCount: 22000000,
    tab: {
      id: 'tab-badtameez-dil',
      tuning: 'Standard E',
      capo: 1,
      difficulty: 'Intermediate',
      chords: ['Em', 'G', 'Am', 'B7'],
      tabContent: `Key: F Minor | Capo: 1st Fret
Groove: 144 BPM Rock 'n' Roll Swing
Chords: Em, G, Am, B7

[Chorus]
Em                    G
Badtameez dil, badtameez dil
Am           B7
Maane na, maane na
Em                    G
Badtameez dil, badtameez dil
Am           B7       Em
Maane na re!`
    }
  },
  {
    id: 'track-ilahi',
    title: 'Ilahi',
    artist: 'Arijit Singh',
    album: 'Yeh Jawaani Hai Deewani',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 130,
    keySignature: 'D',
    difficulty: 'Beginner',
    duration: 228,
    audioUrl: '/audio/track-ilahi.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---2---0---2---3---|',
    lyrics: `[00:10.00] Shaamein malang si, raatein surang si\n[00:28.00] Baaghi udaan pe hi na jaane kyun\n[00:45.00] Ilahi mera ji aaye aaye\n[01:05.00] Kal pe sawaal hai jeena filhaal hai`,
    playCount: 27000000,
    tab: {
      id: 'tab-ilahi',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['D', 'G', 'Bm', 'A'],
      tabContent: `Key: D Major | Standard E Tuning (No Capo)
Tempo: 130 BPM | Upbeat Folk Acoustic Strumming
Strumming Pattern: D - D - U - U - D - U

[Intro Acoustic Riff]
e|---2---2-2-0---0-0---3---3-3-2---2-2---|
B|---3---3-3-3---3-3---3---3-3-3---3-3---|
G|---2---2-2-2---2-2---0---0-0-0---0-0---|
D|-0---0-------0-------------------------|
A|-------------------2---2-------0---0---|
E|---------------------------------------|
   D                   G           A

[Chorus]
D                 G
Ilahi mera ji aaye aaye
Bm                A
Ilahi mera ji aaye aaye
D                 G
Kal pe sawaal hai, jeena filhaal hai
Bm                A          D
Ilahi mera ji aaye aaye!`
    }
  },

  // ── JAZZ / SOUL ──
  {
    id: 'track-kaisi-paheli-zindagani',
    title: 'Kaisi Paheli Zindagani',
    artist: 'Sunidhi Chauhan',
    album: 'Parineeta',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 88,
    keySignature: 'Dm',
    difficulty: 'Advanced',
    duration: 275,
    audioUrl: '/audio/track-kaisi-paheli-zindagani.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---5---6---5---3---|',
    lyrics: `[00:15.00] Kaisi paheli zindagani\n[00:30.00] Kabhi to hansaaye, kabhi ye rulaaye\n[00:50.00] Na poochho ye kaisi hai kahani\n[01:10.00] Kaisi paheli zindagani`,
    playCount: 12000000,
    tab: {
      id: 'tab-kaisi-paheli-zindagani',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Advanced',
      chords: ['Dm', 'Gm6', 'A7', 'Bbmaj7', 'C7', 'Fmaj7'],
      tabContent: `Key: D Minor | Classic Gypsy Jazz Swing
Chords: Dm, Gm6, A7, Bbmaj7, C7, Fmaj7
Tempo: 88 BPM | Fingerstyle Gypsy Jazz Comping

[Verse]
Dm                Gm6
Kaisi paheli hai ye zindagani
A7                     Dm
Kabhi to hansaaye, kabhi ye rulaaye
Dm                Gm6
Na poochho ye kaisi hai kahani
A7                  Dm
Kaisi paheli zindagani`
    }
  },
  {
    id: 'track-musafir-hoon-yaaron',
    title: 'Musafir Hoon Yaaron',
    artist: 'Kishore Kumar, R.D. Burman',
    album: 'Parichay',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 96,
    keySignature: 'C',
    difficulty: 'Intermediate',
    duration: 288,
    audioUrl: '/audio/track-musafir-hoon-yaaron.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0---1---0-------|',
    lyrics: `[00:10.00] Musafir hoon yaaron, na ghar hai na thikaana\n[00:30.00] Mujhe chalte jaana hai, bas chalte jaana\n[00:55.00] Ek raah mud gayi to doosri shuru hui\n[01:15.00] Musafir hoon yaaron`,
    playCount: 19500000,
    tab: {
      id: 'tab-musafir-hoon-yaaron',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['C', 'Am', 'F', 'G7'],
      tabContent: `Key: C Major | Acoustic Swing Folk
Chords: C, Am, F, G7
Rhythm: Bossa Nova / Folk 4/4

[Chorus]
C              Am
Musafir hoon yaaron
F              G7
Na ghar hai na thikaana
C              Am
Mujhe chalte jaana hai
F              C
Bas chalte jaana`
    }
  },
  {
    id: 'track-fly-me-to-the-moon',
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra, Count Basie',
    album: 'It Might as Well Be Swing',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 118,
    keySignature: 'Am',
    difficulty: 'Intermediate',
    duration: 147,
    audioUrl: '/audio/track-fly-me-to-the-moon.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---5---7---8---7---|',
    lyrics: `[00:08.00] Fly me to the moon\n[00:14.00] Let me play among the stars\n[00:20.00] Let me see what spring is like on Jupiter and Mars\n[00:30.00] In other words, hold my hand\n[00:40.00] In other words, baby, kiss me`,
    playCount: 45000000,
    tab: {
      id: 'tab-fly-me-to-the-moon',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Am7', 'Dm7', 'G7', 'Cmaj7', 'Fmaj7', 'Bm7b5', 'E7'],
      tabContent: `Key: A Minor / C Major | Jazz Swing 118 BPM
Chords: Am7, Dm7, G7, Cmaj7, Fmaj7, Bm7b5, E7

[Chorus]
Am7           Dm7          G7           Cmaj7
Fly me to the moon, let me play among the stars
Fmaj7             Bm7b5        E7             Am7  A7
Let me see what spring is like on Jupiter and Mars
Dm7           G7        Cmaj7   A7
In other words, hold my hand
Dm7           G7        E7     Am7
In other words, baby, kiss me`
    }
  },

  // ── CLASSIC ──
  {
    id: 'track-kun-faya-kun',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman, Mohit Chauhan, Javed Ali',
    album: 'Rockstar',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 80,
    keySignature: 'Em',
    difficulty: 'Intermediate',
    duration: 472,
    audioUrl: '/audio/track-kun-faya-kun.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0---2---3---2---|',
    lyrics: `[00:30.00] Ya Nizamuddin Auliya\n[01:00.00] Kun faya kun, kun faya kun\n[01:40.00] Jab kahin pe kuch nahi bhi nahi tha\n[02:10.00] Wahi tha wahi tha wahi tha wahi tha`,
    playCount: 38000000,
    tab: {
      id: 'tab-kun-faya-kun',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['Em', 'D', 'C', 'G', 'Am'],
      tabContent: `Key: E Minor | Master Sufi Classical Tuning
Chords: Em, D, C, G, Am
Tempo: 80 BPM | Slow spiritual 6/8 acoustic arpeggio

[Chorus]
Em             D
Kun faya kun, kun faya kun
C              D
Faya kun, faya kun
Em            D
Jab kahin pe kuch nahi bhi nahi tha
C            D          Em
Wahi tha, wahi tha, wahi tha`
    }
  },
  {
    id: 'track-tum-se-hi',
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan',
    album: 'Jab We Met',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 86,
    keySignature: 'D',
    difficulty: 'Beginner',
    duration: 321,
    audioUrl: '/audio/track-tum-se-hi.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---2---3---5---3---|',
    lyrics: `[00:15.00] Na hai yeh pana, na khona hi hai\n[00:32.00] Tera na hona, jaane kyun hona hi hai\n[00:50.00] Tum se hi din hota hai, surmaiye shaam aati hai\n[01:10.00] Tum se hi, tum se hi`,
    playCount: 31000000,
    tab: {
      id: 'tab-tum-se-hi',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['D', 'Bm', 'G', 'A'],
      tabContent: `Key: D Major | Standard E Tuning
Chords: D, Bm, G, A
Tempo: 86 BPM | Soulful Acoustic Ballad

[Intro Plucking]
e|---2---2-------2---2-------3---3-------0---0---|
B|-----3---3-------3---3-------3---3-------2---2-|
G|-----------------------------------------------|
D|-0---------------------------------------------|
A|-------------2-----------------------0---------|
E|-------------------------3---------------------|
   D           Bm          G           A

[Chorus]
D                   Bm
Tum se hi din hota hai
G                    A
Surmaiye shaam aati hai
D             Bm
Tum se hi, tum se hi
G                    A
Har ghadi saans aati hai`
    }
  },
  {
    id: 'track-tujhe-dekha-toh',
    title: 'Tujhe Dekha Toh',
    artist: 'Kumar Sanu, Lata Mangeshkar',
    album: 'Dilwale Dulhania Le Jayenge',
    category: 'acoustic',
    tuning: 'Standard E',
    bpm: 84,
    keySignature: 'Em',
    difficulty: 'Beginner',
    duration: 302,
    audioUrl: '/audio/track-tujhe-dekha-toh.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---0---2---3---5---|',
    lyrics: `[00:20.00] Tujhe dekha toh yeh jaana sanam\n[00:38.00] Pyaar hota hai deewana sanam\n[00:58.00] Ab yahan se kahan jaayein hum\n[01:15.00] Teri baahon mein mar jaayein hum`,
    playCount: 42000000,
    tab: {
      id: 'tab-tujhe-dekha-toh',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Beginner',
      chords: ['Em', 'D', 'C', 'B7'],
      tabContent: `Key: E Minor | All-Time Classic Mandolin & Guitar Riff
Chords: Em, D, C, B7
Tempo: 84 BPM | Strumming: D - D - U - U - D - U

[Signature Mandolin / Guitar Lead]
e|---0-2-3-2-0---0-2-3-5-3-2-0---|
B|-0-----------0-----------------|
G|-------------------------------|

[Chorus]
Em                  D
Tujhe dekha toh yeh jaana sanam
C                 B7
Pyaar hota hai deewana sanam
Em                 D
Ab yahan se kahan jaayein hum
C                  B7          Em
Teri baahon mein mar jaayein hum`
    }
  },

  // ── ROCK ──
  {
    id: 'track-sadda-haq',
    title: 'Sadda Haq',
    artist: 'Mohit Chauhan, A.R. Rahman, Orianthi',
    album: 'Rockstar',
    category: 'electric',
    tuning: 'Drop D',
    bpm: 124,
    keySignature: 'Dm',
    difficulty: 'Advanced',
    duration: 365,
    audioUrl: '/audio/track-sadda-haq.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'D|---0---0---12---10---|',
    lyrics: `[00:20.00] Sadda haq aithe rakh!\n[00:40.00] Na sahe hum kyun sahe hum\n[01:10.00] Sadda haq aithe rakh!\n[01:35.00] Sheron ke panje cheene tu kyun`,
    playCount: 29000000,
    tab: {
      id: 'tab-sadda-haq',
      tuning: 'Drop D (D-A-D-G-B-E)',
      capo: 0,
      difficulty: 'Advanced',
      chords: ['D5', 'F5', 'G5', 'Bb5', 'C5'],
      tabContent: `Tuning: Drop D (D-A-D-G-B-E) | Stadium Rock Anthem
Distortion: High Gain Modern Valve Amp
Tempo: 124 BPM

[Heavy Intro Riff]
e|-------------------------------------|
B|-------------------------------------|
G|-------------------------------------|
D|-0-0-12-10-12---0-0-12-10-12--15-14--|
A|-0-0-12-10-12---0-0-12-10-12--15-14--|
D|-0-0-12-10-12---0-0-12-10-12--15-14--|

[Chorus]
D5
Sadda haq aithe rakh!
F5        G5
Sadda haq aithe rakh!
Bb5          C5
Kyun sahe hum, kyun chup rahe hum
D5
Sadda haq aithe rakh!`
    }
  },
  {
    id: 'track-bhaag-dk-bose',
    title: 'Bhaag D.K. Bose',
    artist: 'Ram Sampath',
    album: 'Delhi Belly',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 156,
    keySignature: 'E',
    difficulty: 'Intermediate',
    duration: 242,
    audioUrl: '/audio/track-bhaag-dk-bose.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|-------------------|',
    lyrics: `[00:10.00] Daddy mujhse bola tu galti hai meri\n[00:25.00] Bhaag bhaag D.K. Bose, D.K. Bose, D.K. Bose\n[00:45.00] Bhaag bhaag D.K. Bose bhaag\n[01:05.00] Aandhi aayi aandhi aayi`,
    playCount: 18000000,
    tab: {
      id: 'tab-bhaag-dk-bose',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['E5', 'G5', 'A5', 'C5', 'D5'],
      tabContent: `Key: E Minor / E Power Chord | Punk Rock 156 BPM
Downstroke Punk Power Chords

[Chorus]
E5              G5
Bhaag bhaag D.K. Bose, D.K. Bose, D.K. Bose
A5              C5     D5
Bhaag bhaag D.K. Bose bhaag!
E5
Aandhi aayi, aandhi aayi!`
    }
  },
  {
    id: 'track-rock-on-title',
    title: 'Rock On!!',
    artist: 'Farhan Akhtar',
    album: 'Rock On!!',
    category: 'electric',
    tuning: 'Standard E',
    bpm: 138,
    keySignature: 'A',
    difficulty: 'Intermediate',
    duration: 236,
    audioUrl: '/audio/track-rock-on-title.m4a',
    coverUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&auto=format&fit=crop&q=80',
    tabPreview: 'e|---5---5---5---5---|',
    lyrics: `[00:15.00] Dil kya kehta hai mera\n[00:30.00] Kya main sunoon, tum suno\n[00:50.00] Rock on, hai ye waqt ka ishaara\n[01:10.00] Rock on, har lamha pukaara`,
    playCount: 21000000,
    tab: {
      id: 'tab-rock-on-title',
      tuning: 'Standard E',
      capo: 0,
      difficulty: 'Intermediate',
      chords: ['A5', 'C5', 'D5', 'F5', 'G5'],
      tabContent: `Key: A Minor / A Major | Classic Indian Hard Rock
Rhythm: Driving 8th note crunch guitar
Tempo: 138 BPM

[Intro Power Riff]
e|-------------------------------|
B|-------------------------------|
G|-------------------------------|
D|-7-7-10-10-12-12---7-7-10-12---|
A|-7-7-10-10-12-12---7-7-10-12---|
E|-5-5--8--8-10-10---5-5--8-10---|

[Chorus]
A5             C5
Rock on, hai ye waqt ka ishaara
D5             F5     G5
Rock on, har lamha pukaara
A5             C5
Rock on, chhu le aasmaan tu saara
D5             F5     G5
Rock on!`
    }
  }
];

// Helper to sanitize
const clean = str => (str ? str.replace(/'/g, "''") : '');

for (const s of NEW_ANTHEM_SONGS) {
  const artistId = `artist-${s.artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const albumId = `album-${s.album.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  dbHelper.run(`
    INSERT OR IGNORE INTO artists (id, name, bio, image_url, genre, monthly_listeners)
    VALUES (?, ?, ?, ?, ?, ?)
  `, artistId, s.artist, `${s.artist} on Resonance`, s.coverUrl, s.category, s.playCount);

  dbHelper.run(`
    INSERT OR IGNORE INTO albums (id, title, artist_id, release_year, cover_url, genre)
    VALUES (?, ?, ?, ?, ?, ?)
  `, albumId, s.album, artistId, 2011, s.coverUrl, s.category);

  // Insert into tracks
  dbHelper.run(`
    INSERT OR REPLACE INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, s.id, s.title, artistId, s.artist, albumId, s.album, s.duration, s.audioUrl, s.coverUrl, s.category, 2011, s.playCount, 0, s.lyrics);

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

  console.log(`✅ Ingested: ${s.title} (${s.artist})`);
}

console.log('🎉 All 12 Genre Anthem songs and Guitar Tabs saved to SQLite database successfully!');

