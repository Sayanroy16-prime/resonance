import { dbHelper } from './database.js';
import { LEGENDARY_100_TRACKS, LEGENDARY_100_GUITAR_TRACKS } from '../../../src/data/legendaryTracks.js';

console.log('⚡ Ingesting 100 Legendary Classics, Country, and Modern Timeless tracks into SQLite database...');

for (let i = 0; i < LEGENDARY_100_TRACKS.length; i++) {
  const track = LEGENDARY_100_TRACKS[i];
  const gTrack = LEGENDARY_100_GUITAR_TRACKS[i];

  const artistId = `artist-${track.artist.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const albumId = `album-${track.album.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const playCountNum = parseInt(track.playCount.replace(/,/g, ''), 10) || 15000000;

  // Insert artist
  dbHelper.run(`
    INSERT OR IGNORE INTO artists (id, name, bio, image_url, genre, monthly_listeners)
    VALUES (?, ?, ?, ?, ?, ?)
  `, artistId, track.artist, `${track.artist} legendary discography on Resonance`, track.coverUrl, track.genre, playCountNum);

  // Insert album
  dbHelper.run(`
    INSERT OR IGNORE INTO albums (id, title, artist_id, release_year, cover_url, genre)
    VALUES (?, ?, ?, ?, ?, ?)
  `, albumId, track.album, artistId, track.releaseYear, track.coverUrl, track.genre);

  // Insert track
  dbHelper.run(`
    INSERT OR REPLACE INTO tracks (id, title, artist_id, artist_name, album_id, album_title, duration, audio_url, cover_url, genre, release_year, play_count, is_explicit, lyrics)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, track.id, track.title, artistId, track.artist, albumId, track.album, track.duration, track.audioUrl, track.coverUrl, track.genre, track.releaseYear, playCountNum, 0, track.lyrics);

  // Insert guitar track
  dbHelper.run(`
    INSERT OR REPLACE INTO guitar_tracks (id, title, artist_name, category, tuning, bpm, key_signature, difficulty, duration, audio_url, cover_url, tab_preview, lyrics, play_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, gTrack.id, gTrack.title, gTrack.artist, gTrack.category, gTrack.tuning, gTrack.bpm, gTrack.keySignature, gTrack.difficulty, gTrack.duration, gTrack.audioUrl, gTrack.coverUrl, gTrack.tabPreview, gTrack.lyrics, playCountNum);

  // Insert guitar tab
  dbHelper.run(`
    INSERT OR REPLACE INTO guitar_tabs (id, track_id, title, artist, tuning, capo, difficulty, chords_json, tab_content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, gTrack.tab.id, gTrack.id, gTrack.title, gTrack.artist, gTrack.tab.tuning, gTrack.tab.capo, gTrack.tab.difficulty, JSON.stringify(gTrack.tab.chords), gTrack.tab.tabContent);
}

console.log(`🎉 Ingested all ${LEGENDARY_100_TRACKS.length} legendary songs into SQLite database successfully!`);
