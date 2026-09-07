import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// High quality thematic Unsplash images for rich album art
const COVERS = {
  rockClassic: [
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
  ],
  countryFolk: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1445985543469-221e57446239?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&auto=format&fit=crop&q=80'
  ],
  popModern: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  ]
};

// Safe audio preview streams from standard public audio CDN / Google Sound library
const SAMPLE_AUDIOS = [
  'https://actions.google.com/sounds/v1/music/rock_guitar.ogg',
  'https://actions.google.com/sounds/v1/music/guitar_chords.ogg',
  'https://actions.google.com/sounds/v1/music/acoustic_stroll.ogg',
  'https://actions.google.com/sounds/v1/music/daytime_forest_bonfire.ogg',
  'https://actions.google.com/sounds/v1/music/bright_acoustic_guitar.ogg',
  'https://actions.google.com/sounds/v1/music/sunset_vibes.ogg'
];

export const RAW_100_SONGS = [
  // ── 1-40 Classic Rock & Pop Legends ──
  {
    num: 1, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', year: 1975, duration: 354,
    genre: 'Classic Rock', category: 'electric', difficulty: 'Advanced', tuning: 'Standard E', bpm: 72, key: 'Bb',
    chords: ['Bb', 'Gm', 'Cm', 'F7', 'Eb', 'D', 'G', 'A'],
    tabPreview: 'e|---6-5-3-1--------|',
    lyrics: `[00:01.00] Is this the real life? Is this just fantasy?\n[00:15.00] Caught in a landslide, no escape from reality\n[00:30.00] Open your eyes, look up to the skies and see\n[00:55.00] Mama, just killed a man\n[01:05.00] Put a gun against his head, pulled my trigger now he's dead`
  },
  {
    num: 2, title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', year: 1976, duration: 391,
    genre: 'Classic Rock', category: 'fingerstyle', difficulty: 'Advanced', tuning: 'Standard E', bpm: 75, key: 'Bm',
    chords: ['Bm', 'F#', 'A', 'E', 'G', 'D', 'Em'],
    tabPreview: 'e|-------2-----2-----|',
    lyrics: `[00:10.00] On a dark desert highway, cool wind in my hair\n[00:25.00] Warm smell of colitas, rising up through the air\n[00:48.00] Welcome to the Hotel California\n[00:55.00] Such a lovely place, such a lovely face`
  },
  {
    num: 3, title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', year: 1971, duration: 482,
    genre: 'Classic Rock', category: 'fingerstyle', difficulty: 'Advanced', tuning: 'Standard E', bpm: 82, key: 'Am',
    chords: ['Am', 'G#aug', 'C', 'D', 'Fmaj7', 'G'],
    tabPreview: 'e|-------5-7-----8---|',
    lyrics: `[00:15.00] There's a lady who's sure all that glitters is gold\n[00:30.00] And she's buying a stairway to heaven\n[00:50.00] When she gets there she knows, if the stores are all closed\n[01:05.00] With a word she can get what she came for`
  },
  {
    num: 4, title: 'Imagine', artist: 'John Lennon', album: 'Imagine', year: 1971, duration: 183,
    genre: 'Classic', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 76, key: 'C',
    chords: ['C', 'Cmaj7', 'F', 'Am', 'Dm', 'G', 'E7'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:08.00] Imagine there's no heaven, it's easy if you try\n[00:22.00] No hell below us, above us only sky\n[00:40.00] Imagine all the people living for today\n[01:05.00] You may say I'm a dreamer, but I'm not the only one`
  },
  {
    num: 5, title: 'Hey Jude', artist: 'The Beatles', album: 'Hey Jude', year: 1968, duration: 431,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 74, key: 'F',
    chords: ['F', 'C', 'C7', 'Bb', 'Gm', 'F7'],
    tabPreview: 'e|---1-------0-------|',
    lyrics: `[00:06.00] Hey Jude, don't make it bad\n[00:15.00] Take a sad song and make it better\n[00:28.00] Remember to let her into your heart\n[00:38.00] Then you can start to make it better\n[01:20.00] Na na na na na na na, Hey Jude`
  },
  {
    num: 6, title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', year: 1991, duration: 301,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 117, key: 'Fm',
    chords: ['F5', 'Bb5', 'Ab5', 'Db5'],
    tabPreview: 'e|-------------------| B|-------------------| G|-------3-3---------| D|--3-3--3-3--6-6--8--|',
    lyrics: `[00:25.00] Load up on guns, bring your friends\n[00:33.00] It's fun to lose and to pretend\n[00:45.00] With the lights out, it's less dangerous\n[00:52.00] Here we are now, entertain us`
  },
  {
    num: 7, title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', year: 1982, duration: 294,
    genre: 'Pop', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 117, key: 'F#m',
    chords: ['F#m', 'G#m', 'A', 'B'],
    tabPreview: 'e|-------------------| B|-------------------| G|-------------------| D|-----4-------4-----| A|---4---4---4---4---|',
    lyrics: `[00:18.00] She was more like a beauty queen from a movie scene\n[00:30.00] I said don't mind, but what do you mean, I am the one\n[00:55.00] Billie Jean is not my lover\n[01:03.00] She's just a girl who claims that I am the one`
  },
  {
    num: 8, title: 'Like a Rolling Stone', artist: 'Bob Dylan', album: 'Highway 61 Revisited', year: 1965, duration: 369,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 95, key: 'C',
    chords: ['C', 'Dm', 'Em', 'F', 'G'],
    tabPreview: 'e|---0---1---0---1---|',
    lyrics: `[00:12.00] Once upon a time you dressed so fine\n[00:25.00] Threw the bums a dime in your prime, didn't you?\n[00:55.00] How does it feel? How does it feel?\n[01:05.00] To be without a home, like a complete unknown, like a rolling stone`
  },
  {
    num: 9, title: 'Purple Rain', artist: 'Prince', album: 'Purple Rain', year: 1984, duration: 520,
    genre: 'Classic', category: 'electric', difficulty: 'Advanced', tuning: 'Standard E', bpm: 57, key: 'Bb',
    chords: ['Bb', 'Gm', 'F', 'Eb'],
    tabPreview: 'e|---1-------3-------|',
    lyrics: `[00:20.00] I never meant to cause you any sorrow\n[00:35.00] I never meant to cause you any pain\n[01:10.00] Purple rain, purple rain\n[01:25.00] Only want to see you laughing in the purple rain`
  },
  {
    num: 10, title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: 'Appetite for Destruction', year: 1987, duration: 356,
    genre: 'Rock', category: 'electric', difficulty: 'Advanced', tuning: 'Half-Step Down', bpm: 125, key: 'Db',
    chords: ['D', 'C', 'G', 'A'],
    tabPreview: 'e|-----15--12--15----|',
    lyrics: `[00:22.00] She's got a smile that it seems to me\n[00:30.00] Reminds me of childhood memories\n[00:50.00] Whoa, sweet child o' mine\n[01:00.00] Whoa, oh, oh, oh sweet love of mine`
  },
  {
    num: 11, title: 'Every Breath You Take', artist: 'The Police', album: 'Synchronicity', year: 1983, duration: 253,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 117, key: 'Ab',
    chords: ['A', 'F#m', 'D', 'E'],
    tabPreview: 'e|-------0-----0-----|',
    lyrics: `[00:08.00] Every breath you take and every move you make\n[00:20.00] Every bond you break, every step you take, I'll be watching you\n[00:45.00] Oh can't you see, you belong to me`
  },
  {
    num: 12, title: 'Born to Run', artist: 'Bruce Springsteen', album: 'Born to Run', year: 1975, duration: 270,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 148, key: 'E',
    chords: ['E', 'A', 'B', 'C#m', 'F#m'],
    tabPreview: 'e|---0---0---0---0---|',
    lyrics: `[00:15.00] In the day we sweat it out on the streets of a runaway American dream\n[00:35.00] Tramps like us, baby we were born to run`
  },
  {
    num: 13, title: 'What a Wonderful World', artist: 'Louis Armstrong', album: 'What a Wonderful World', year: 1967, duration: 141,
    genre: 'Classic', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 66, key: 'F',
    chords: ['F', 'Am', 'Bb', 'C', 'Dm', 'Gm'],
    tabPreview: 'e|---1-------0-------|',
    lyrics: `[00:05.00] I see trees of green, red roses too\n[00:18.00] I see them bloom for me and you\n[00:32.00] And I think to myself: What a wonderful world`
  },
  {
    num: 14, title: 'Stand by Me', artist: 'Ben E. King', album: "Don't Play That Song!", year: 1961, duration: 178,
    genre: 'Classic', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 118, key: 'A',
    chords: ['A', 'F#m', 'D', 'E'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:12.00] When the night has come and the land is dark\n[00:24.00] And the moon is the only light we'll see\n[00:45.00] Darling, darling stand by me, oh stand by me`
  },
  {
    num: 15, title: 'Wonderwall', artist: 'Oasis', album: "(What's the Story) Morning Glory?", year: 1995, duration: 258,
    genre: 'Rock', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 87, key: 'Em',
    chords: ['Em7', 'G', 'Dsus4', 'A7sus4', 'Cadd9'],
    tabPreview: 'e|---3---3---3---3---|',
    lyrics: `[00:12.00] Today is gonna be the day that they're gonna throw it back to you\n[00:35.00] Because maybe, you're gonna be the one that saves me\n[00:50.00] And after all, you're my wonderwall`
  },
  {
    num: 16, title: "Livin' on a Prayer", artist: 'Bon Jovi', album: 'Slippery When Wet', year: 1986, duration: 249,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 123, key: 'Em',
    chords: ['Em', 'C', 'D', 'G'],
    tabPreview: 'e|-------------------| B|-------------------| G|-------------------| D|--2-2---2-2--------|',
    lyrics: `[00:20.00] Tommy used to work on the docks, union's been on strike\n[00:45.00] Whoa, we're half way there\n[00:52.00] Whoa, livin' on a prayer\n[01:02.00] Take my hand, we'll make it I swear`
  },
  {
    num: 17, title: "Don't Stop Believin'", artist: 'Journey', album: 'Escape', year: 1981, duration: 251,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 119, key: 'E',
    chords: ['E', 'B', 'C#m', 'A'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:12.00] Just a small-town girl, livin' in a lonely world\n[00:30.00] She took the midnight train goin' anywhere\n[01:10.00] Don't stop believin', hold on to that feelin'`
  },
  {
    num: 18, title: 'Good Vibrations', artist: 'The Beach Boys', album: 'Smiley Smile', year: 1966, duration: 217,
    genre: 'Pop', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 152, key: 'Ebm',
    chords: ['Ebm', 'Db', 'Cb', 'Bb', 'Gb'],
    tabPreview: 'e|---6-------4-------|',
    lyrics: `[00:08.00] I hear the sound of a gentle word\n[00:25.00] I'm pickin' up good vibrations\n[00:32.00] She's givin' me excitations\n[00:40.00] Good, good, good vibrations`
  },
  {
    num: 19, title: 'Waterloo Sunset', artist: 'The Kinks', album: 'Something Else by The Kinks', year: 1967, duration: 195,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 104, key: 'E',
    chords: ['E', 'B', 'A', 'F#m'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:10.00] Dirty old river, must you keep rolling, rolling into the night\n[00:35.00] But I don't need no friends\n[00:45.00] As long as I gaze on Waterloo sunset, I am in paradise`
  },
  {
    num: 20, title: 'Heroes', artist: 'David Bowie', album: '"Heroes"', year: 1977, duration: 371,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 112, key: 'D',
    chords: ['D', 'G', 'C', 'Am'],
    tabPreview: 'e|---2-------3-------|',
    lyrics: `[00:20.00] I, I will be king, and you, you will be queen\n[00:48.00] We can beat them, for ever and ever\n[01:00.00] Oh we can be heroes, just for one day`
  },
  {
    num: 21, title: 'Yesterday', artist: 'The Beatles', album: 'Help!', year: 1965, duration: 125,
    genre: 'Classic', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 96, key: 'F',
    chords: ['F', 'Em7', 'A7', 'Dm', 'Bb', 'C7'],
    tabPreview: 'e|---1-------0-------|',
    lyrics: `[00:04.00] Yesterday, all my troubles seemed so far away\n[00:15.00] Now it looks as though they're here to stay\n[00:25.00] Oh, I believe in yesterday`
  },
  {
    num: 22, title: 'Light My Fire', artist: 'The Doors', album: 'The Doors', year: 1967, duration: 426,
    genre: 'Rock', category: 'electric', difficulty: 'Advanced', tuning: 'Standard E', bpm: 124, key: 'Am',
    chords: ['Am7', 'F#m7', 'G', 'A', 'D', 'E'],
    tabPreview: 'e|---5-------2-------|',
    lyrics: `[00:15.00] You know that it would be untrue, you know that I would be a liar\n[00:32.00] Come on baby, light my fire\n[00:42.00] Try to set the night on fire`
  },
  {
    num: 23, title: 'Satisfaction (I Can\'t Get No)', artist: 'The Rolling Stones', album: 'Out of Our Heads', year: 1965, duration: 224,
    genre: 'Rock', category: 'electric', difficulty: 'Beginner', tuning: 'Standard E', bpm: 136, key: 'E',
    chords: ['E', 'A', 'B7', 'D'],
    tabPreview: 'e|-------------------| B|-------------------| G|-------------------| D|--2-2-2-4-5-5-5-4-2-|',
    lyrics: `[00:10.00] I can't get no satisfaction\n[00:18.00] I can't get no satisfaction\n[00:25.00] 'Cause I try and I try and I try and I try\n[00:35.00] I can't get no`
  },
  {
    num: 24, title: 'Superstition', artist: 'Stevie Wonder', album: 'Talking Book', year: 1972, duration: 266,
    genre: 'Pop', category: 'electric', difficulty: 'Advanced', tuning: 'Standard E', bpm: 100, key: 'Ebm',
    chords: ['Ebm7', 'Bb7', 'Ab7'],
    tabPreview: 'e|-------------------| B|-------------------| G|--6h8-8-8-6-------|',
    lyrics: `[00:15.00] Very superstitious, writing's on the wall\n[00:28.00] Very superstitious, ladder's 'bout to fall\n[00:48.00] When you believe in things that you don't understand\n[00:58.00] Then you suffer, superstition ain't the way`
  },
  {
    num: 25, title: 'Africa', artist: 'Toto', album: 'Toto IV', year: 1982, duration: 295,
    genre: 'Pop', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 92, key: 'B',
    chords: ['B', 'D#m', 'G#m', 'F#', 'E', 'A'],
    tabPreview: 'e|---2-------6-------|',
    lyrics: `[00:20.00] I hear the drums echoing tonight\n[00:35.00] She hears only whispers of some quiet conversation\n[01:00.00] It's gonna take a lot to drag me away from you\n[01:10.00] There's nothing that a hundred men or more could ever do\n[01:20.00] I bless the rains down in Africa`
  },
  {
    num: 26, title: 'Dreams', artist: 'Fleetwood Mac', album: 'Rumours', year: 1977, duration: 257,
    genre: 'Classic', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 120, key: 'F',
    chords: ['F', 'G'],
    tabPreview: 'e|---1-------3-------|',
    lyrics: `[00:14.00] Now here you go again, you say you want your freedom\n[00:30.00] Well who am I to keep you down\n[00:50.00] Thunder only happens when it's raining\n[01:02.00] Players only love you when they're playing`
  },
  {
    num: 27, title: 'A Horse with No Name', artist: 'America', album: 'America', year: 1971, duration: 252,
    genre: 'Classic', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 123, key: 'Em',
    chords: ['Em', 'F#m11'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:10.00] On the first part of the journey I was looking at all the life\n[00:32.00] I've been through the desert on a horse with no name\n[00:44.00] It felt good to be out of the rain`
  },
  {
    num: 28, title: 'Careless Whisper', artist: 'George Michael', album: 'Make It Big', year: 1984, duration: 302,
    genre: 'Pop', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 76, key: 'Dm',
    chords: ['Dm', 'Gm', 'Bb', 'Am'],
    tabPreview: 'e|---1-------3-------|',
    lyrics: `[00:20.00] I feel so unsure as I take your hand and lead you to the dance floor\n[00:45.00] I'm never gonna dance again, guilty feet have got no rhythm\n[01:05.00] Though it's easy to pretend, I know you're not a fool`
  },
  {
    num: 29, title: 'Stayin\' Alive', artist: 'Bee Gees', album: 'Saturday Night Fever', year: 1977, duration: 285,
    genre: 'Pop', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 104, key: 'Fm',
    chords: ['Fm', 'Eb', 'Bbm', 'C7'],
    tabPreview: 'e|-------------------| B|--6-6-6-6----------|',
    lyrics: `[00:15.00] Well, you can tell by the way I use my walk\n[00:25.00] I'm a woman's man, no time to talk\n[00:50.00] Ah, ha, ha, ha, stayin' alive, stayin' alive`
  },
  {
    num: 30, title: 'Dancing Queen', artist: 'ABBA', album: 'Arrival', year: 1976, duration: 231,
    genre: 'Pop', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 101, key: 'A',
    chords: ['A', 'D', 'E', 'F#m', 'C#m'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:12.00] You can dance, you can jive\n[00:20.00] Having the time of your life\n[00:35.00] See that girl, watch that scene, diggin' the dancing queen`
  },
  {
    num: 31, title: 'Eye of the Tiger', artist: 'Survivor', album: 'Eye of the Tiger', year: 1982, duration: 245,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 109, key: 'Cm',
    chords: ['Cm', 'Ab', 'Bb'],
    tabPreview: 'e|-------------------| B|-------------------| G|--5-5-5---5-3-3----|',
    lyrics: `[00:20.00] Rising up, back on the street\n[00:30.00] Did my time, took my chances\n[00:55.00] It's the eye of the tiger, it's the thrill of the fight\n[01:08.00] Rising up to the challenge of our rival`
  },
  {
    num: 32, title: 'Free Bird', artist: 'Lynyrd Skynyrd', album: 'Pronounced \'Lĕh-\'nérd \'Skin-\'nérd', year: 1973, duration: 548,
    genre: 'Rock', category: 'electric', difficulty: 'Advanced', tuning: 'Standard E', bpm: 118, key: 'G',
    chords: ['G', 'D/F#', 'Em', 'F', 'C', 'D'],
    tabPreview: 'e|-------3-----2-----|',
    lyrics: `[00:30.00] If I leave here tomorrow, would you still remember me?\n[01:05.00] 'Cause I'm as free as a bird now\n[01:20.00] And this bird you cannot change`
  },
  {
    num: 33, title: 'American Pie', artist: 'Don McLean', album: 'American Pie', year: 1971, duration: 513,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 138, key: 'G',
    chords: ['G', 'D', 'Em', 'Am', 'C'],
    tabPreview: 'e|---3-------2-------|',
    lyrics: `[00:15.00] A long, long time ago, I can still remember how that music used to make me smile\n[01:10.00] Bye-bye, Miss American Pie\n[01:20.00] Drove my Chevy to the levee, but the levee was dry`
  },
  {
    num: 34, title: 'Piano Man', artist: 'Billy Joel', album: 'Piano Man', year: 1973, duration: 338,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 88, key: 'C',
    chords: ['C', 'G/B', 'Am', 'C/G', 'F', 'C/E', 'D7', 'G'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:20.00] It's nine o'clock on a Saturday, the regular crowd shuffles in\n[00:50.00] Sing us a song, you're the piano man\n[01:02.00] Sing us a song tonight`
  },
  {
    num: 35, title: 'The Sound of Silence', artist: 'Simon & Garfunkel', album: 'Wednesday Morning, 3 A.M.', year: 1964, duration: 185,
    genre: 'Classic', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 104, key: 'D#m',
    chords: ['Am', 'G', 'F', 'C'],
    tabPreview: 'e|-------0-----0-----|',
    lyrics: `[00:05.00] Hello darkness, my old friend, I've come to talk with you again\n[00:30.00] Because a vision softly creeping, left its seeds while I was sleeping\n[00:55.00] And the vision that was planted in my brain still remains\n[01:10.00] Within the sound of silence`
  },
  {
    num: 36, title: "Knockin' on Heaven's Door", artist: 'Bob Dylan', album: 'Pat Garrett & Billy the Kid', year: 1973, duration: 150,
    genre: 'Classic', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 68, key: 'G',
    chords: ['G', 'D', 'Am', 'C'],
    tabPreview: 'e|---3---2---0---0---|',
    lyrics: `[00:10.00] Mama, take this badge off of me, I can't use it anymore\n[00:35.00] Knock, knock, knockin' on heaven's door\n[00:48.00] Knock, knock, knockin' on heaven's door`
  },
  {
    num: 37, title: 'Sittin\' on the Dock of the Bay', artist: 'Otis Redding', album: 'The Dock of the Bay', year: 1968, duration: 161,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 103, key: 'G',
    chords: ['G', 'B7', 'C', 'A'],
    tabPreview: 'e|---3-------2-------|',
    lyrics: `[00:12.00] Sittin' in the mornin' sun, I'll be sittin' when the evenin' comes\n[00:35.00] Sittin' on the dock of the bay, wastin' time`
  },
  {
    num: 38, title: 'Paint It Black', artist: 'The Rolling Stones', album: 'Aftermath', year: 1966, duration: 202,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 159, key: 'Em',
    chords: ['Em', 'B7', 'D', 'G', 'C'],
    tabPreview: 'e|---0-2-3-5-3-2-0---|',
    lyrics: `[00:08.00] I see a red door and I want it painted black\n[00:20.00] No colors anymore, I want them to turn black\n[00:40.00] I see the girls walk by dressed in their summer clothes\n[00:50.00] I have to turn my head until my darkness goes`
  },
  {
    num: 39, title: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', album: 'Second Helping', year: 1974, duration: 284,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 98, key: 'D',
    chords: ['D', 'Cadd9', 'G'],
    tabPreview: 'e|-------2-------3---| B|-----3---3---3---3-|',
    lyrics: `[00:18.00] Big wheels keep on turnin', carry me home to see my kin\n[00:45.00] Sweet home Alabama, where the skies are so blue\n[00:58.00] Sweet home Alabama, Lord I'm comin' home to you`
  },
  {
    num: 40, title: 'Another Brick in the Wall', artist: 'Pink Floyd', album: 'The Wall', year: 1979, duration: 239,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 104, key: 'Dm',
    chords: ['Dm', 'G', 'C', 'F'],
    tabPreview: 'e|---1-------3-------| B|---3-------0-------|',
    lyrics: `[00:20.00] We don't need no education, we don't need no thought control\n[00:42.00] No dark sarcasm in the classroom\n[00:54.00] Teachers, leave them kids alone\n[01:05.00] Hey! Teachers! Leave them kids alone!\n[01:15.00] All in all it's just another brick in the wall`
  },

  // ── 41-70 Country, Western & Folk ──
  {
    num: 41, title: 'El Paso', artist: 'Marty Robbins', album: 'Gunfighter Ballads and Trail Songs', year: 1959, duration: 261,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 106, key: 'D',
    chords: ['D', 'Em', 'A7', 'G'],
    tabPreview: 'e|---2-------0-------|',
    lyrics: `[00:08.00] Out in the West Texas town of El Paso, I fell in love with a Mexican girl\n[00:35.00] Nighttime would find me in Rosa's cantina, music would play and Felina would whirl`
  },
  {
    num: 42, title: '(Ghost) Riders in the Sky', artist: 'Johnny Cash', album: 'Silver', year: 1979, duration: 226,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 114, key: 'Am',
    chords: ['Am', 'C', 'F', 'Dm'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:15.00] An old cowboy went riding out one dark and windy day\n[00:35.00] Yippie yi ooh, yippie yi yaay\n[00:50.00] Ghost riders in the sky`
  },
  {
    num: 43, title: 'Ring of Fire', artist: 'Johnny Cash', album: 'Ring of Fire: The Best of Johnny Cash', year: 1963, duration: 157,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 104, key: 'G',
    chords: ['G', 'C', 'D'],
    tabPreview: 'e|---3-------0-------|',
    lyrics: `[00:10.00] Love is a burning thing, and it makes a fiery ring\n[00:30.00] I fell into a burning ring of fire\n[00:40.00] I went down, down, down, and the flames went higher`
  },
  {
    num: 44, title: 'Folsom Prison Blues', artist: 'Johnny Cash', album: 'Johnny Cash with His Hot and Blue Guitar!', year: 1955, duration: 168,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 102, key: 'E',
    chords: ['E', 'A', 'B7'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:08.00] I hear the train a comin', it's rolling 'round the bend\n[00:20.00] And I ain't seen the sunshine since I don't know when\n[00:38.00] I'm stuck in Folsom Prison, and time keeps draggin' on`
  },
  {
    num: 45, title: 'I Walk the Line', artist: 'Johnny Cash', album: 'Johnny Cash with His Hot and Blue Guitar!', year: 1956, duration: 165,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 106, key: 'F',
    chords: ['F', 'C7', 'Bb'],
    tabPreview: 'e|---1-------0-------|',
    lyrics: `[00:10.00] I keep a close watch on this heart of mine\n[00:22.00] I keep my eyes wide open all the time\n[00:40.00] Because you're mine, I walk the line`
  },
  {
    num: 46, title: "Mamas, Don't Let Your Babies Grow Up to Be Cowboys", artist: 'Waylon Jennings & Willie Nelson', album: 'Waylon & Willie', year: 1978, duration: 213,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 108, key: 'D',
    chords: ['D', 'G', 'A'],
    tabPreview: 'e|---2-------3-------|',
    lyrics: `[00:12.00] Mamas, don't let your babies grow up to be cowboys\n[00:25.00] Don't let 'em pick guitars or drive them old trucks\n[00:40.00] Let 'em be doctors and lawyers and such`
  },
  {
    num: 47, title: 'On the Road Again', artist: 'Willie Nelson', album: 'Honeysuckle Rose', year: 1980, duration: 153,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 111, key: 'E',
    chords: ['E', 'G#7', 'F#m', 'A', 'B7'],
    tabPreview: 'e|---0-------4-------|',
    lyrics: `[00:08.00] On the road again, just can't wait to get on the road again\n[00:20.00] The life I love is making music with my friends\n[00:35.00] And I can't wait to get on the road again`
  },
  {
    num: 48, title: 'Pancho and Lefty', artist: 'Merle Haggard & Willie Nelson', album: 'Pancho & Lefty', year: 1983, duration: 288,
    genre: 'Country', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 98, key: 'D',
    chords: ['D', 'A', 'G', 'Bm'],
    tabPreview: 'e|---2-------0-------|',
    lyrics: `[00:14.00] Living on the road my friend, was gonna keep you free and clean\n[00:38.00] Now you wear your skin like iron, and your breath's as hard as kerosene\n[01:05.00] Pancho was a bandit boys, his horse was fast as polished steel`
  },
  {
    num: 49, title: 'The Gambler', artist: 'Kenny Rogers', album: 'The Gambler', year: 1978, duration: 212,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 87, key: 'Eb',
    chords: ['Eb', 'Ab', 'Bb'],
    tabPreview: 'e|---3-------4-------|',
    lyrics: `[00:18.00] On a warm summer's evenin' on a train bound for nowhere\n[00:35.00] I met up with the gambler, we were both too tired to sleep\n[01:05.00] You've got to know when to hold 'em, know when to fold 'em\n[01:15.00] Know when to walk away, and know when to run`
  },
  {
    num: 50, title: 'Stand by Your Man', artist: 'Tammy Wynette', album: 'Stand by Your Man', year: 1968, duration: 161,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 92, key: 'B',
    chords: ['B', 'F#', 'E', 'G#m'],
    tabPreview: 'e|---2-------2-------|',
    lyrics: `[00:10.00] Sometimes it's hard to be a woman, giving all your love to just one man\n[00:35.00] Stand by your man, give him two arms to cling to`
  },
  {
    num: 51, title: 'Crazy', artist: 'Patsy Cline', album: 'Showcase', year: 1961, duration: 163,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 68, key: 'Bb',
    chords: ['Bb', 'G7', 'Cm', 'F7', 'Eb'],
    tabPreview: 'e|---1-------1-------|',
    lyrics: `[00:08.00] Crazy, I'm crazy for feeling so lonely\n[00:25.00] I'm crazy, crazy for feeling so blue\n[00:45.00] I knew you'd love me as long as you wanted\n[01:00.00] And then someday you'd leave me for somebody new`
  },
  {
    num: 52, title: 'I Will Always Love You', artist: 'Dolly Parton', album: 'Jolene', year: 1974, duration: 175,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 67, key: 'A',
    chords: ['A', 'F#m', 'D', 'E'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:08.00] If I should stay, I would only be in your way\n[00:30.00] So I'll go, but I know I'll think of you each step of the way\n[00:50.00] And I will always love you\n[01:05.00] I will always love you`
  },
  {
    num: 53, title: 'Take Me Home, Country Roads', artist: 'John Denver', album: 'Poems, Prayers & Promises', year: 1971, duration: 190,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 82, key: 'A',
    chords: ['A', 'F#m', 'E', 'D', 'G'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:08.00] Almost heaven, West Virginia, Blue Ridge Mountains, Shenandoah River\n[00:35.00] Country roads, take me home to the place I belong\n[00:48.00] West Virginia, mountain mama, take me home, country roads`
  },
  {
    num: 54, title: 'King of the Road', artist: 'Roger Miller', album: 'The Return of Roger Miller', year: 1965, duration: 147,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 121, key: 'Bb',
    chords: ['Bb', 'Eb', 'F'],
    tabPreview: 'e|---1-------3-------|',
    lyrics: `[00:06.00] Trailers for sale or rent, rooms to let, fifty cents\n[00:20.00] No phone, no pool, no pets, I ain't got no cigarettes\n[00:38.00] Two hours of pushin' broom buys an eight by twelve four-bit room\n[00:50.00] I'm a man of means by no means, king of the road`
  },
  {
    num: 55, title: 'He Stopped Loving Her Today', artist: 'George Jones', album: 'I Am What I Am', year: 1980, duration: 197,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 72, key: 'G',
    chords: ['G', 'C', 'D', 'G7'],
    tabPreview: 'e|---3-------0-------|',
    lyrics: `[00:15.00] He said "I'll love you till I die", she told him "You'll forget in time"\n[00:45.00] He stopped loving her today, they placed a wreath upon his door\n[01:10.00] And soon they'll carry him away, he stopped loving her today`
  },
  {
    num: 56, title: 'The Devil Went Down to Georgia', artist: 'The Charlie Daniels Band', album: 'Million Mile Reflections', year: 1979, duration: 215,
    genre: 'Country', category: 'electric', difficulty: 'Advanced', tuning: 'Standard E', bpm: 135, key: 'Dm',
    chords: ['Dm', 'C', 'Bb', 'A'],
    tabPreview: 'e|---1-------0-------|',
    lyrics: `[00:12.00] The Devil went down to Georgia, he was lookin' for a soul to steal\n[00:30.00] Fire on the Mountain, run boys, run! Devil's in the House of the Rising Sun!`
  },
  {
    num: 57, title: 'Friends in Low Places', artist: 'Garth Brooks', album: 'No Fences', year: 1990, duration: 258,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 104, key: 'A',
    chords: ['A', 'Bbdim', 'Bm', 'E7'],
    tabPreview: 'e|---0-------1-------|',
    lyrics: `[00:15.00] Blame it all on my roots, I showed up in boots and ruined your black tie affair\n[00:48.00] 'Cause I've got friends in low places, where the whiskey drowns and the beer chases`
  },
  {
    num: 58, title: 'Wagon Wheel', artist: 'Old Crow Medicine Show', album: 'Old Crow Medicine Show', year: 2004, duration: 232,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 75, key: 'A',
    chords: ['A', 'E', 'F#m', 'D'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:12.00] Headed down south to the land of the pines\n[00:35.00] So rock me mama like a wagon wheel, rock me mama any way you feel\n[00:50.00] Hey mama rock me`
  },
  {
    num: 59, title: 'Amarillo by Morning', artist: 'George Strait', album: 'Strait from the Heart', year: 1982, duration: 172,
    genre: 'Country', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 90, key: 'D',
    chords: ['D', 'F#m', 'G', 'A', 'Em'],
    tabPreview: 'e|---2-------2-------|',
    lyrics: `[00:10.00] Amarillo by morning, up from San Antone\n[00:30.00] Everything that I've got is just what I've got on\n[00:55.00] Amarillo by morning, Amarillo's on my mind`
  },
  {
    num: 60, title: 'Back in the Saddle Again', artist: 'Gene Autry', album: 'Back in the Saddle Again', year: 1939, duration: 155,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 110, key: 'C',
    chords: ['C', 'F', 'G7'],
    tabPreview: 'e|---0-------1-------|',
    lyrics: `[00:08.00] I'm back in the saddle again, out where a friend is a friend\n[00:30.00] Where the longhorn cattle feed on the lowly jimson weed\n[00:48.00] I'm back in the saddle again`
  },
  {
    num: 61, title: 'Cool Water', artist: 'Marty Robbins', album: 'Gunfighter Ballads and Trail Songs', year: 1959, duration: 189,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 95, key: 'C',
    chords: ['C', 'F', 'G', 'Am'],
    tabPreview: 'e|---0-------1-------|',
    lyrics: `[00:10.00] All day I've faced a barren waste without the taste of water, cool water\n[00:40.00] Dan, can you see that big green tree where the water's runnin' free`
  },
  {
    num: 62, title: 'San Antonio Rose', artist: 'Bob Wills & His Texas Playboys', album: 'San Antonio Rose', year: 1940, duration: 158,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 120, key: 'G',
    chords: ['G', 'C', 'D7', 'A7'],
    tabPreview: 'e|---3-------0-------|',
    lyrics: `[00:12.00] Deep within my heart lies a melody, a song of old San Antone\n[00:40.00] Rose of San Antone, sweet flower of Mexico`
  },
  {
    num: 63, title: 'High Noon (Do Not Forsake Me)', artist: 'Frankie Laine', album: 'High Noon Soundtrack', year: 1952, duration: 161,
    genre: 'Country', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 96, key: 'F',
    chords: ['F', 'Bb', 'C7', 'Dm'],
    tabPreview: 'e|---1-------1-------|',
    lyrics: `[00:10.00] Do not forsake me, oh my darlin' on this, our weddin' day\n[00:35.00] Wait along, wait along, wait along, wait along`
  },
  {
    num: 64, title: "Your Cheatin' Heart", artist: 'Hank Williams', album: "Hank Williams Sings", year: 1953, duration: 162,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 84, key: 'C',
    chords: ['C', 'F', 'G7'],
    tabPreview: 'e|---0-------1-------|',
    lyrics: `[00:08.00] Your cheatin' heart will make you weep, you'll cry and cry and try to sleep\n[00:35.00] But sleep won't come the whole night through, your cheatin' heart will tell on you`
  },
  {
    num: 65, title: 'Hey, Good Lookin\'', artist: 'Hank Williams', album: "Hey, Good Lookin'", year: 1951, duration: 175,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 132, key: 'C',
    chords: ['C', 'D7', 'G7', 'F'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:08.00] Hey, good lookin' - whatcha got cookin'?\n[00:20.00] How's about cookin' somethin' up with me?\n[00:38.00] Hey, sweet baby, don't you think maybe we could find us a brand new recipe?`
  },
  {
    num: 66, title: 'Blue Eyes Crying in the Rain', artist: 'Willie Nelson', album: 'Red Headed Stranger', year: 1975, duration: 140,
    genre: 'Country', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 90, key: 'E',
    chords: ['E', 'B7', 'A'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:08.00] In the twilight glow I see her, blue eyes crying in the rain\n[00:30.00] When we kissed goodbye and parted, I knew we'd never meet again`
  },
  {
    num: 67, title: 'Red River Valley', artist: 'Traditional Western', album: 'Cowboy Songs of the Old West', year: 1927, duration: 170,
    genre: 'Country', category: 'fingerstyle', difficulty: 'Beginner', tuning: 'Standard E', bpm: 88, key: 'G',
    chords: ['G', 'D7', 'C'],
    tabPreview: 'e|---3-------2-------|',
    lyrics: `[00:10.00] From this valley they say you are going, we will miss your bright eyes and sweet smile\n[00:40.00] Come and sit by my side if you love me, do not hasten to bid me adieu`
  },
  {
    num: 68, title: 'The Yellow Rose of Texas', artist: 'Gene Autry', album: 'Western Classics', year: 1933, duration: 165,
    genre: 'Country', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 112, key: 'D',
    chords: ['D', 'A7', 'G'],
    tabPreview: 'e|---2-------0-------|',
    lyrics: `[00:08.00] There's a yellow rose in Texas that I am going to see\n[00:28.00] Nobody else could know her, nobody only me\n[00:48.00] She cried so when I left her, it like to broke my heart`
  },
  {
    num: 69, title: 'Tennessee Waltz', artist: 'Patti Page', album: 'Tennessee Waltz', year: 1950, duration: 183,
    genre: 'Country', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 84, key: 'C',
    chords: ['C', 'C7', 'F', 'G7', 'E7', 'Am'],
    tabPreview: 'e|---0-------1-------|',
    lyrics: `[00:10.00] I was dancing with my darling to the Tennessee Waltz\n[00:30.00] When an old friend I happened to see\n[00:50.00] I introduced her to my loved one, and while they were dancing\n[01:05.00] My friend stole my sweetheart from me`
  },
  {
    num: 70, title: 'Desperado', artist: 'Eagles', album: 'Desperado', year: 1973, duration: 213,
    genre: 'Country', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 60, key: 'G',
    chords: ['G', 'G7', 'C', 'Cm', 'Em7', 'A7', 'D7'],
    tabPreview: 'e|-------3-----3-----|',
    lyrics: `[00:10.00] Desperado, why don't you come to your senses?\n[00:25.00] You been out ridin' fences for so long now\n[00:50.00] Oh, you're a hard one, but I know that you got your reasons\n[01:10.00] These things that are pleasin' you can hurt you somehow`
  },

  // ── 71-100 Ballads, Pop-Rock & Modern Timeless Tracks ──
  {
    num: 71, title: 'My Way', artist: 'Frank Sinatra', album: 'My Way', year: 1969, duration: 275,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 75, key: 'D',
    chords: ['D', 'F#m', 'Em', 'A7', 'D7', 'G', 'Gm'],
    tabPreview: 'e|---2-------2-------|',
    lyrics: `[00:10.00] And now, the end is near, and so I face the final curtain\n[00:38.00] I planned each charted course, each careful step along the byway\n[01:05.00] And more, much more than this, I did it my way`
  },
  {
    num: 72, title: 'Hallelujah', artist: 'Leonard Cohen', album: 'Various Positions', year: 1984, duration: 280,
    genre: 'Classic', category: 'fingerstyle', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 56, key: 'C',
    chords: ['C', 'Am', 'F', 'G', 'E7'],
    tabPreview: 'e|-------0-----0-----|',
    lyrics: `[00:12.00] I've heard there was a secret chord that David played and it pleased the Lord\n[00:35.00] But you don't really care for music, do you?\n[00:55.00] Hallelujah, Hallelujah, Hallelujah, Hallelujah`
  },
  {
    num: 73, title: 'Unchained Melody', artist: 'The Righteous Brothers', album: 'Just Once in My Life', year: 1965, duration: 216,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 82, key: 'C',
    chords: ['C', 'Am', 'F', 'G', 'Em', 'C7'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:08.00] Oh, my love, my darling, I've hungered for your touch a long, lonely time\n[00:45.00] Time goes by so slowly and time can do so much, are you still mine?`
  },
  {
    num: 74, title: 'Yesterday Once More', artist: 'Carpenters', album: 'Now & Then', year: 1973, duration: 236,
    genre: 'Classic', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 82, key: 'E',
    chords: ['E', 'G#m', 'C#m', 'A', 'B'],
    tabPreview: 'e|---0-------4-------|',
    lyrics: `[00:10.00] When I was young I'd listen to the radio, waitin' for my favorite songs\n[00:38.00] Every sha-la-la-la, every wo-o-wo-o, still shines\n[00:55.00] Every shing-a-ling-a-ling that they're startin' to sing's so fine`
  },
  {
    num: 75, title: 'Nothing Else Matters', artist: 'Metallica', album: 'Metallica', year: 1991, duration: 388,
    genre: 'Rock', category: 'fingerstyle', difficulty: 'Advanced', tuning: 'Standard E', bpm: 46, key: 'Em',
    chords: ['Em', 'D', 'C', 'G', 'B7'],
    tabPreview: 'e|-------0-----0-----|',
    lyrics: `[00:30.00] So close, no matter how far, couldn't be much more from the heart\n[01:00.00] Forever trusting who we are, and nothing else matters\n[01:25.00] Never opened myself this way, life is ours, we live it our way`
  },
  {
    num: 76, title: 'November Rain', artist: "Guns N' Roses", album: 'Use Your Illusion I', year: 1991, duration: 537,
    genre: 'Rock', category: 'electric', difficulty: 'Advanced', tuning: 'Half-Step Down', bpm: 80, key: 'B',
    chords: ['F', 'Dm', 'C', 'G'],
    tabPreview: 'e|---1-------1-------|',
    lyrics: `[00:45.00] When I look into your eyes, I can see a love restrained\n[01:15.00] But darlin' when I hold you, don't you know I feel the same?\n[02:00.00] 'Cause nothin' lasts forever, and we both know hearts can change\n[02:25.00] And it's hard to hold a candle in the cold November rain`
  },
  {
    num: 77, title: 'With or Without You', artist: 'U2', album: 'The Joshua Tree', year: 1987, duration: 296,
    genre: 'Rock', category: 'electric', difficulty: 'Beginner', tuning: 'Standard E', bpm: 110, key: 'D',
    chords: ['D', 'A', 'Bm', 'G'],
    tabPreview: 'e|---2-------0-------|',
    lyrics: `[00:15.00] See the stone set in your eyes, see the thorn twist in your side\n[00:45.00] With or without you, with or without you\n[01:10.00] I can't live with or without you`
  },
  {
    num: 78, title: 'Everywhere', artist: 'Fleetwood Mac', album: 'Tango in the Night', year: 1987, duration: 223,
    genre: 'Pop', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 115, key: 'B',
    chords: ['B', 'E', 'G#m', 'F#'],
    tabPreview: 'e|---2-------0-------|',
    lyrics: `[00:12.00] Can you hear me calling out your name? You know that I'm falling and I don't know what to say\n[00:42.00] Oh I, I want to be with you everywhere`
  },
  {
    num: 79, title: 'Truly Madly Deeply', artist: 'Savage Garden', album: 'Savage Garden', year: 1997, duration: 278,
    genre: 'Pop', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 84, key: 'C',
    chords: ['C', 'G', 'F', 'G'],
    tabPreview: 'e|---0-------3-------|',
    lyrics: `[00:10.00] I'll be your dream, I'll be your wish, I'll be your fantasy\n[00:35.00] I'll be your hope, I'll be your love, be everything that you need\n[00:55.00] I want to stand with you on a mountain, I want to bathe with you in the sea\n[01:15.00] I want to lay like this forever, until the sky falls down on me`
  },
  {
    num: 80, title: 'Iris', artist: 'The Goo Goo Dolls', album: 'Dizzy Up the Girl', year: 1998, duration: 289,
    genre: 'Rock', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 156, key: 'Bm',
    chords: ['Bm', 'A', 'G', 'D'],
    tabPreview: 'e|---2-------0-------|',
    lyrics: `[00:15.00] And I'd give up forever to touch you, 'cause I know that you feel me somehow\n[00:45.00] And I don't want the world to see me, 'cause I don't think that they'd understand\n[01:05.00] When everything's made to be broken, I just want you to know who I am`
  },
  {
    num: 81, title: 'Fix You', artist: 'Coldplay', album: 'X&Y', year: 2005, duration: 295,
    genre: 'Rock', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 70, key: 'Eb',
    chords: ['Eb', 'Gm', 'Cm7', 'Bb'],
    tabPreview: 'e|---3-------3-------|',
    lyrics: `[00:15.00] When you try your best, but you don't succeed\n[00:30.00] When you get what you want, but not what you need\n[01:10.00] Lights will guide you home, and ignite your bones\n[01:30.00] And I will try to fix you`
  },
  {
    num: 82, title: 'Chasing Cars', artist: 'Snow Patrol', album: 'Eyes Open', year: 2006, duration: 268,
    genre: 'Rock', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 104, key: 'A',
    chords: ['A', 'E/G#', 'D'],
    tabPreview: 'e|-------------------| B|--2-2-2-2-2-2-2-2---|',
    lyrics: `[00:10.00] We'll do it all, everything, on our own\n[00:30.00] If I lay here, if I just lay here\n[00:45.00] Would you lie with me and just forget the world?`
  },
  {
    num: 83, title: 'Halo', artist: 'Beyoncé', album: 'I Am... Sasha Fierce', year: 2008, duration: 261,
    genre: 'Pop', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 84, key: 'A',
    chords: ['A', 'Bm', 'F#m', 'D'],
    tabPreview: 'e|---0-------2-------|',
    lyrics: `[00:12.00] Remember those walls I built? Well, baby, they're tumbling down\n[00:40.00] Everywhere I'm looking now, I'm surrounded by your embrace\n[01:05.00] Baby, I can see your halo, you know you're my saving grace`
  },
  {
    num: 84, title: 'Rolling in the Deep', artist: 'Adele', album: '21', year: 2010, duration: 228,
    genre: 'Pop', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 105, key: 'Cm',
    chords: ['Cm', 'G', 'Bb', 'Ab'],
    tabPreview: 'e|---3-------3-------|',
    lyrics: `[00:10.00] There's a fire starting in my heart, reaching a fever pitch and it's bringing me out the dark\n[00:40.00] We could have had it all, rolling in the deep\n[00:55.00] You had my heart inside of your hand, and you played it to the beat`
  },
  {
    num: 85, title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', year: 2017, duration: 233,
    genre: 'Pop', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 96, key: 'C#m',
    chords: ['C#m', 'F#m', 'A', 'B'],
    tabPreview: 'e|---4-------2-------|',
    lyrics: `[00:08.00] The club isn't the best place to find a lover, so the bar is where I go\n[00:32.00] I'm in love with the shape of you, we push and pull like a magnet do\n[00:48.00] Although my heart is falling too, I'm in love with your body`
  },
  {
    num: 86, title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep, Where Do We Go?', year: 2019, duration: 194,
    genre: 'Pop', category: 'electric', difficulty: 'Beginner', tuning: 'Standard E', bpm: 135, key: 'Gm',
    chords: ['Gm', 'Cm', 'D7'],
    tabPreview: 'e|-------------------| B|-------------------| G|--0-0-3-0-0-3-0----|',
    lyrics: `[00:12.00] White shirt now red, my bloody nose\n[00:25.00] Sleeping, you're on your tippy toes\n[00:45.00] So you're a tough guy, like it really rough guy\n[01:05.00] I'm that bad type, make your mama sad type, make your girlfriend mad tight... I'm the bad guy`
  },
  {
    num: 87, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', year: 2019, duration: 200,
    genre: 'Pop', category: 'electric', difficulty: 'Beginner', tuning: 'Standard E', bpm: 171, key: 'F#m',
    chords: ['F#m', 'C#m', 'E', 'B'],
    tabPreview: 'e|---2-------4-------|',
    lyrics: `[00:15.00] I've been on my own for long enough, maybe you can show me how to love, maybe\n[00:45.00] I said, ooh, I'm blinded by the lights\n[01:00.00] No, I can't sleep until I feel your touch`
  },
  {
    num: 88, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', year: 2019, duration: 174,
    genre: 'Pop', category: 'electric', difficulty: 'Beginner', tuning: 'Standard E', bpm: 95, key: 'Dm',
    chords: ['Dm', 'Am', 'C', 'G'],
    tabPreview: 'e|---5-------5-------|',
    lyrics: `[00:10.00] Strawberries on a summer evening, baby, you're the end of June\n[00:35.00] Watermelon sugar high, watermelon sugar high`
  },
  {
    num: 89, title: 'Viva La Vida', artist: 'Coldplay', album: 'Viva la Vida or Death and All His Friends', year: 2008, duration: 242,
    genre: 'Rock', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 138, key: 'Ab',
    chords: ['C#', 'D#', 'G#', 'Fm'],
    tabPreview: 'e|---4-------6-------|',
    lyrics: `[00:15.00] I used to rule the world, seas would rise when I gave the word\n[00:45.00] I hear Jerusalem bells a-ringin', Roman cavalry choirs are singin'\n[01:05.00] Be my mirror, my sword and shield, my missionaries in a foreign field`
  },
  {
    num: 90, title: 'Someone Like You', artist: 'Adele', album: '21', year: 2011, duration: 285,
    genre: 'Pop', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 67, key: 'A',
    chords: ['A', 'C#m/G#', 'F#m', 'D'],
    tabPreview: 'e|-------0-----0-----|',
    lyrics: `[00:12.00] I heard that you're settled down, that you found a girl and you're married now\n[00:45.00] Never mind, I'll find someone like you\n[01:02.00] I wish nothing but the best for you too, "Don't forget me," I beg`
  },
  {
    num: 91, title: 'Use Somebody', artist: 'Kings of Leon', album: 'Only by the Night', year: 2008, duration: 230,
    genre: 'Rock', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 137, key: 'C',
    chords: ['C', 'C/E', 'F', 'Am'],
    tabPreview: 'e|---0-------0-------|',
    lyrics: `[00:18.00] I've been roaming around, always looking down at all I see\n[00:45.00] You know that I could use somebody, you know that I could use somebody`
  },
  {
    num: 92, title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', year: 2004, duration: 222,
    genre: 'Rock', category: 'electric', difficulty: 'Advanced', tuning: 'Half-Step Down', bpm: 148, key: 'Db',
    chords: ['Db', 'Db/C', 'Gb'],
    tabPreview: 'e|-------------------| B|--14-14-14-14-------|',
    lyrics: `[00:10.00] Coming out of my cage and I've been doing just fine\n[00:25.00] Gotta gotta be down because I want it all\n[00:50.00] Jealousy, turning saints into the sea\n[01:05.00] Swimming through sick lullabies, choking on your alibis\n[01:15.00] But it's just the price I pay, destiny is calling me\n[01:25.00] Open up my eager eyes, 'cause I'm Mr. Brightside`
  },
  {
    num: 93, title: 'Yellow', artist: 'Coldplay', album: 'Parachutes', year: 2000, duration: 269,
    genre: 'Rock', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 88, key: 'B',
    chords: ['B', 'F#', 'E', 'G#m'],
    tabPreview: 'e|---2-------2-------|',
    lyrics: `[00:12.00] Look at the stars, look how they shine for you\n[00:30.00] And everything you do, yeah they were all yellow\n[00:55.00] Your skin, oh yeah, your skin and bones, turn into something beautiful\n[01:15.00] And you know, for you I'd bleed myself dry`
  },
  {
    num: 94, title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', year: 2002, duration: 326,
    genre: 'Pop', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 86, key: 'Dm',
    chords: ['Dm', 'Bb', 'C'],
    tabPreview: 'e|-------------------| B|--6-6-6-6----------|',
    lyrics: `[00:15.00] Look, if you had one shot or one opportunity to seize everything you ever wanted in one moment\n[00:40.00] His palms are sweaty, knees weak, arms are heavy\n[00:52.00] There's vomit on his sweater already, mom's spaghetti\n[01:10.00] You better lose yourself in the music, the moment, you own it, you better never let it go`
  },
  {
    num: 95, title: 'Hey Ya!', artist: 'Outkast', album: 'Speakerboxxx/The Love Below', year: 2003, duration: 235,
    genre: 'Pop', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 159, key: 'G',
    chords: ['G', 'C', 'D', 'E'],
    tabPreview: 'e|---3-------0-------|',
    lyrics: `[00:12.00] One, two, three, go! My baby don't mess around because she loves me so\n[00:40.00] Hey ya! Hey ya! Hey ya! Hey ya!\n[01:05.00] Shake it, shake it like a Polaroid picture!`
  },
  {
    num: 96, title: 'Toxic', artist: 'Britney Spears', album: 'In the Zone', year: 2003, duration: 198,
    genre: 'Pop', category: 'electric', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 143, key: 'Cm',
    chords: ['Cm', 'Eb', 'G7', 'Ab'],
    tabPreview: 'e|---3-------6-------|',
    lyrics: `[00:15.00] Baby, can't you see I'm calling? A guy like you should wear a warning\n[00:40.00] With a taste of your lips, I'm on a ride\n[00:55.00] You're toxic, I'm slippin' under, with a taste of a poison paradise`
  },
  {
    num: 97, title: 'Poker Face', artist: 'Lady Gaga', album: 'The Fame', year: 2008, duration: 237,
    genre: 'Pop', category: 'electric', difficulty: 'Beginner', tuning: 'Standard E', bpm: 119, key: 'G#m',
    chords: ['G#m', 'E', 'B', 'F#'],
    tabPreview: 'e|---4-------0-------|',
    lyrics: `[00:10.00] Mum-mum-mum-mah, mum-mum-mum-mah\n[00:25.00] I wanna hold 'em like they do in Texas, please\n[00:50.00] Can't read my, can't read my, no he can't read my poker face\n[01:05.00] P-p-p-poker face, f-f-fuck her face`
  },
  {
    num: 98, title: 'Firework', artist: 'Katy Perry', album: 'Teenage Dream', year: 2010, duration: 228,
    genre: 'Pop', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 124, key: 'Ab',
    chords: ['Ab', 'Bbm', 'Fm', 'Db'],
    tabPreview: 'e|---4-------1-------|',
    lyrics: `[00:12.00] Do you ever feel like a plastic bag, drifting through the wind, wanting to start again?\n[00:45.00] 'Cause baby, you're a firework\n[00:58.00] Come on, show 'em what you're worth\n[01:10.00] Make 'em go, "Oh, oh, oh", as you shoot across the sky`
  },
  {
    num: 99, title: 'Thinking Out Loud', artist: 'Ed Sheeran', album: 'x (Multiply)', year: 2014, duration: 281,
    genre: 'Pop', category: 'acoustic', difficulty: 'Intermediate', tuning: 'Standard E', bpm: 79, key: 'D',
    chords: ['D', 'D/F#', 'G', 'A'],
    tabPreview: 'e|---2-------2-------|',
    lyrics: `[00:10.00] When your legs don't work like they used to before, and I can't sweep you off of your feet\n[00:40.00] 'Cause honey, your soul could never grow old, it's evergreen\n[01:05.00] And, baby, my heart could still fall as hard at twenty-three\n[01:25.00] So honey now, take me into your loving arms, kiss me under the light of a thousand stars`
  },
  {
    num: 100, title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', album: 'A Star Is Born Soundtrack', year: 2018, duration: 216,
    genre: 'Ballad', category: 'acoustic', difficulty: 'Beginner', tuning: 'Standard E', bpm: 96, key: 'G',
    chords: ['Em7', 'D/F#', 'G', 'C', 'D'],
    tabPreview: 'e|-------3-----2-----|',
    lyrics: `[00:12.00] Tell me somethin', girl: Are you happy in this modern world?\n[00:35.00] Tell me something, boy: Aren't you tired tryin' to fill that void?\n[01:10.00] I'm off the deep end, watch as I dive in, I'll never meet the ground\n[01:30.00] Crash through the surface, where they can't hurt us, we're far from the shallow now`
  }
];

// Function to generate the full objects
export function generateFull100Dataset() {
  const tracks = [];
  const guitarTracks = [];

  RAW_100_SONGS.forEach((s, idx) => {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `track-legend-${s.num}-${slug}`;
    const coverGroup = s.genre.includes('Country') 
      ? COVERS.countryFolk 
      : (s.genre.includes('Rock') || s.genre.includes('Classic') ? COVERS.rockClassic : COVERS.popModern);
    const coverUrl = coverGroup[idx % coverGroup.length];
    const audioUrl = SAMPLE_AUDIOS[idx % SAMPLE_AUDIOS.length];
    const playCount = (12000000 + Math.floor((100 - idx) * 350000)).toLocaleString();

    const trackObj = {
      id,
      title: s.title,
      artist: s.artist,
      album: s.album,
      duration: s.duration,
      coverUrl,
      audioUrl,
      genre: s.genre,
      releaseYear: s.year,
      playCount,
      isExplicit: false,
      lyrics: s.lyrics
    };

    const tabObj = {
      id,
      title: s.title,
      artist: s.artist,
      category: s.category,
      tuning: s.tuning,
      bpm: s.bpm,
      keySignature: s.key,
      difficulty: s.difficulty,
      duration: s.duration,
      audioUrl,
      coverUrl,
      tabPreview: s.tabPreview,
      lyrics: s.lyrics,
      playCount,
      tab: {
        id: `tab-${id}`,
        tuning: s.tuning,
        capo: s.key === 'Bb' ? 3 : s.key === 'F' ? 1 : 0,
        difficulty: s.difficulty,
        chords: s.chords,
        tabContent: `Title: ${s.title} (${s.artist})\nTuning: ${s.tuning} | Tempo: ${s.bpm} BPM | Key: ${s.key}\nChords Used: ${s.chords.join(', ')}\n\n[Intro / Strumming]\nStrumming Pattern: D - D - U - U - D - U\n${s.chords.slice(0, 4).join('   -   ')}\n\n[Verse 1]\n${s.lyrics.split('\\n').map(l => l.replace(/\\[[0-9:.]+\\]\\s*/g, '')).slice(0, 3).join('\\n')}\n\n[Chorus]\n${s.lyrics.split('\\n').map(l => l.replace(/\\[[0-9:.]+\\]\\s*/g, '')).slice(3).join('\\n')}`
      }
    };

    tracks.push(trackObj);
    guitarTracks.push(tabObj);
  });

  return { tracks, guitarTracks };
}

// Generate the legendaryTracks.js file
const { tracks, guitarTracks } = generateFull100Dataset();
const fileContent = `// Auto-generated 100 Legendary Classics, Country, and Modern Timeless Anthems
export const LEGENDARY_100_TRACKS = ${JSON.stringify(tracks, null, 2)};

export const LEGENDARY_100_GUITAR_TRACKS = ${JSON.stringify(guitarTracks, null, 2)};
`;

const outputPath = path.resolve(__dirname, '../src/data/legendaryTracks.js');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`✨ Successfully generated 100 legendary tracks in ${outputPath}!`);
