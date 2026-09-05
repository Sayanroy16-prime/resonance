import { dbHelper } from '../db/database.js';

export const getPersonalizedRecommendations = (userId, limit = 6) => {
  if (!userId) {
    // Return top popular tracks if guest
    return dbHelper.all(`
      SELECT * FROM tracks 
      ORDER BY play_count DESC 
      LIMIT ?
    `, limit);
  }

  // Find user's top genres from history and liked songs
  const topGenres = dbHelper.all(`
    SELECT t.genre, COUNT(*) as frequency 
    FROM (
      SELECT track_id FROM user_history WHERE user_id = ?
      UNION ALL
      SELECT track_id FROM liked_songs WHERE user_id = ?
    ) combined
    JOIN tracks t ON t.id = combined.track_id
    GROUP BY t.genre
    ORDER BY frequency DESC
    LIMIT 3
  `, userId, userId);

  if (!topGenres || topGenres.length === 0) {
    return dbHelper.all(`
      SELECT * FROM tracks 
      ORDER BY play_count DESC 
      LIMIT ?
    `, limit);
  }

  const genreList = topGenres.map(g => `'${g.genre}'`).join(',');

  // Return tracks in those genres that user hasn't yet liked
  return dbHelper.all(`
    SELECT t.* FROM tracks t
    WHERE t.genre IN (${genreList})
      AND t.id NOT IN (SELECT track_id FROM liked_songs WHERE user_id = ?)
    ORDER BY t.play_count DESC
    LIMIT ?
  `, userId, limit);
};

export const getTrendingTracks = (limit = 10) => {
  return dbHelper.all(`
    SELECT * FROM tracks
    ORDER BY play_count DESC
    LIMIT ?
  `, limit);
};
