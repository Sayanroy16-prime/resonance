import React from 'react';
import { Play, Pause, Heart, Download, CheckCircle, Plus, Search as SearchIcon, Music } from 'lucide-react';
import { MOCK_TRACKS, GENRES_LIST } from '../data/mockTracks';

export const SearchView = ({
  tracks = MOCK_TRACKS,
  searchQuery,
  setSearchQuery,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  downloadedTrackIds,
  onDownloadTrack,
  likedTrackIds,
  onToggleLikeTrack,
  onAddToQueue
}) => {
  const query = searchQuery.trim().toLowerCase();
  const allTracks = tracks && tracks.length > 0 ? tracks : MOCK_TRACKS;

  const filteredTracks = allTracks.filter((t) => {
    if (!query) return true;
    const title = (t.title || '').toLowerCase();
    const artist = (t.artist_name || t.artist || '').toLowerCase();
    const album = (t.album_title || t.album || '').toLowerCase();
    const genre = (t.genre || t.category || '').toLowerCase();
    return (
      title.includes(query) ||
      artist.includes(query) ||
      album.includes(query) ||
      genre.includes(query)
    );
  });

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Category Pills & Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 font-['Outfit']">Explore & Search</h2>
        {!query && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {GENRES_LIST.map((genre) => (
              <div
                key={genre.id}
                onClick={() => setSearchQuery(genre.name)}
                className="relative h-28 p-4 rounded-xl cursor-pointer overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200"
                style={{ backgroundColor: genre.bg }}
              >
                <h4 className="text-base font-extrabold text-white">{genre.name}</h4>
                <Music className="w-16 h-16 text-white/20 absolute -bottom-2 -right-2 rotate-12" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Track Results Table */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 font-['Outfit'] flex items-center justify-between">
          <span>{query ? `Search Results for "${searchQuery}"` : 'All Tracks'}</span>
          <span className="text-xs text-gray-400 font-medium">{filteredTracks.length} tracks found</span>
        </h3>

        {filteredTracks.length === 0 ? (
          <div className="text-center py-16 bg-[#16161D] rounded-2xl border border-white/5">
            <SearchIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No tracks found matching "{searchQuery}"</h4>
            <p className="text-xs text-gray-500 mt-1">Try searching by artist name, genre (e.g. "Lofi"), or track title.</p>
          </div>
        ) : (
          <div className="bg-[#14141B] rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-xs text-gray-400">
              <thead className="bg-[#0F0F14] text-gray-500 font-bold uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Album</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Genre</th>
                  <th className="py-3.5 px-4 text-center">Duration</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTracks.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isPlayingThis = isCurrent && isPlaying;
                  const isDownloaded = downloadedTrackIds.includes(track.id);
                  const isLiked = likedTrackIds.includes(track.id);

                  return (
                    <tr 
                      key={track.id}
                      className={`group hover:bg-[#1E1E28] transition-colors ${
                        isCurrent ? 'bg-[#1DB954]/10 text-white' : ''
                      }`}
                    >
                      {/* Index / Play Button */}
                      <td className="py-3 px-4 text-center font-semibold">
                        <div className="relative flex items-center justify-center">
                          <span className="group-hover:hidden">{idx + 1}</span>
                          <button
                            onClick={() => isCurrent ? onTogglePlay() : onPlayTrack(track)}
                            className="hidden group-hover:flex text-white hover:text-[#1DB954] transition"
                          >
                            {isPlayingThis ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Track Title & Artist */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={track.coverUrl} 
                            alt={track.title} 
                            className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className={`font-bold truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                              {track.title}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{track.artist}</p>
                          </div>
                        </div>
                      </td>

                      {/* Album */}
                      <td className="py-3 px-4 hidden md:table-cell font-medium text-gray-300 truncate">
                        {track.album}
                      </td>

                      {/* Genre */}
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold text-gray-300 border border-white/10">
                          {track.genre}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-4 text-center font-medium">
                        {formatDuration(track.duration)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          {/* Offline Download Toggle */}
                          <button
                            onClick={() => onDownloadTrack(track)}
                            className="text-gray-400 hover:text-white transition"
                            title={isDownloaded ? "Downloaded Offline" : "Download to IndexedDB"}
                          >
                            {isDownloaded ? (
                              <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>

                          {/* Heart Like Toggle */}
                          <button
                            onClick={() => onToggleLikeTrack(track.id)}
                            className={`transition ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-400 hover:text-white'}`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                          </button>

                          {/* Add to Queue */}
                          <button
                            onClick={() => onAddToQueue(track)}
                            className="text-gray-400 hover:text-white transition"
                            title="Add to queue"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
