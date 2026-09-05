import React, { useState } from 'react';
import { Plus, Heart, Download, Trash2, Play, X, Search, CheckCircle } from 'lucide-react';
import { MOCK_PLAYLISTS, MOCK_TRACKS } from '../data/mockTracks';

const fmtTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

export const LibraryView = ({
  userPlaylists = [],
  onCreatePlaylist,
  onDeletePlaylist,
  onSelectPlaylist,
  onSelectLiked,
  onSelectDownloaded,
  likedTrackIds = [],
  downloadedTrackIds = [],
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  tracks = MOCK_TRACKS,
  onToggleLikeTrack,
  onDownloadTrack,
  onAddToQueue
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'playlists' | 'liked' | 'downloaded'
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreatePlaylist({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom user playlist',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
    });
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  const allPlaylists = [...MOCK_PLAYLISTS, ...userPlaylists];
  const query = searchQuery.trim().toLowerCase();

  const allFilteredTracks = tracks.filter(t => {
    if (!query) return true;
    const title = (t.title || '').toLowerCase();
    const artist = (t.artist_name || t.artist || '').toLowerCase();
    const album = (t.album_title || t.album || '').toLowerCase();
    const genre = (t.genre || t.category || '').toLowerCase();
    return title.includes(query) || artist.includes(query) || album.includes(query) || genre.includes(query);
  });

  const likedTracks = tracks.filter(t => likedTrackIds.includes(t.id));
  const downloadedTracks = tracks.filter(t => downloadedTrackIds.includes(t.id));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-['Outfit']">Music Library</h2>
          <p className="text-xs text-gray-400 mt-1">Search and manage your entire song collection, playlists, and favorites.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-neon-green px-5 py-2.5 flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold"
        >
          <Plus className="w-4 h-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Tab Navigation Pills & In-Library Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'all' ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/20' : 'bg-[#16161D] text-gray-400 hover:text-white'
            }`}
          >
            All Songs ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'liked' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-[#16161D] text-gray-400 hover:text-white'
            }`}
          >
            Liked Songs ({likedTrackIds.length})
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'playlists' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-[#16161D] text-gray-400 hover:text-white'
            }`}
          >
            Playlists ({allPlaylists.length})
          </button>
          <button
            onClick={() => setActiveTab('downloaded')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              activeTab === 'downloaded' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-[#16161D] text-gray-400 hover:text-white'
            }`}
          >
            Downloaded ({downloadedTrackIds.length})
          </button>
        </div>

        {/* Search within Library */}
        {(activeTab === 'all' || activeTab === 'liked') && (
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library songs..."
              className="w-full bg-[#16161D] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#00E676] outline-none"
            />
          </div>
        )}
      </div>

      {/* Tab Content: All Songs */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Showing {allFilteredTracks.length} tracks</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-orange-400 hover:underline">
                Clear search
              </button>
            )}
          </div>

          <div className="space-y-1">
            {allFilteredTracks.map((track, idx) => {
              const isActive = currentTrack?.id === track.id;
              const isLiked = likedTrackIds.includes(track.id);
              const isDownloaded = downloadedTrackIds.includes(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl group transition-all duration-200 cursor-pointer ${
                    isActive ? 'bg-[#00E676]/10 border border-[#00E676]/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="w-6 text-center text-xs font-mono text-gray-500">
                    {isActive && isPlaying ? '▶' : idx + 1}
                  </span>

                  <img
                    src={track.cover_url || track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate leading-tight ${isActive ? 'text-[#00E676]' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {track.artist_name || track.artist}
                    </p>
                  </div>

                  <span className="hidden sm:block text-xs text-gray-400 w-36 truncate">
                    {track.album_title || track.album || 'Single'}
                  </span>

                  <span className="hidden md:block text-xs font-medium text-gray-500 w-24">
                    {track.genre || track.category || 'Music'}
                  </span>

                  <span className="text-xs font-mono text-gray-500 w-10 text-right">
                    {fmtTime(track.duration)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleLikeTrack && onToggleLikeTrack(track.id, isLiked)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
                      title={isLiked ? 'Unlike' : 'Like'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => onDownloadTrack && onDownloadTrack(track)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
                      title="Download"
                    >
                      {isDownloaded ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onAddToQueue && onAddToQueue(track)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
                      title="Add to queue"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Liked Songs */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{likedTracks.length} liked tracks</span>
          </div>

          {likedTracks.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-[#16161D]/50 rounded-2xl border border-white/5">
              <Heart className="w-12 h-12 text-gray-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No liked songs yet</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Click the heart icon on any song to save it to your liked collection and feature it on your home circle!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {likedTracks.map((track, idx) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => onPlayTrack(track)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl group transition-all duration-200 cursor-pointer ${
                      isActive ? 'bg-rose-500/10 border border-rose-500/30' : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="w-6 text-center text-xs font-mono text-gray-500">
                      {isActive && isPlaying ? '▶' : idx + 1}
                    </span>

                    <img
                      src={track.cover_url || track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate leading-tight ${isActive ? 'text-rose-400' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {track.artist_name || track.artist}
                      </p>
                    </div>

                    <span className="text-xs font-mono text-gray-500 w-10 text-right">
                      {fmtTime(track.duration)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLikeTrack && onToggleLikeTrack(track.id, true);
                      }}
                      className="p-1.5 rounded-full hover:bg-white/10 transition text-rose-500"
                      title="Remove from Liked"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Playlists */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Liked Songs Tile */}
          <div
            onClick={onSelectLiked}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border border-white/10 cursor-pointer card-hover-lift flex flex-col justify-between h-56"
          >
            <div>
              <Heart className="w-10 h-10 text-white fill-white mb-4" />
              <h3 className="text-xl font-extrabold text-white font-['Outfit']">Liked Songs</h3>
              <p className="text-xs text-white/80 mt-1">{likedTrackIds.length} favorited tracks</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">AUTO PLAYLIST</span>
              <button className="w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>
          </div>

          {allPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist.id)}
              className="group p-4 rounded-2xl bg-[#16161D] hover:bg-[#20202C] border border-white/5 cursor-pointer card-hover-lift flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-3 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src={playlist.coverUrl} 
                    alt={playlist.title} 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl hover:scale-110 transition">
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">{playlist.title}</h4>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{playlist.description}</p>
                  </div>
                  {playlist.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlaylist(playlist.id);
                      }}
                      className="p-1 text-gray-500 hover:text-rose-400 transition"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <span>{playlist.author || 'User Playlist'}</span>
                <span>{playlist.tracks ? playlist.tracks.length : 0} tracks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Downloaded */}
      {activeTab === 'downloaded' && (
        <div className="space-y-3">
          {downloadedTracks.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-[#16161D]/50 rounded-2xl border border-white/5">
              <Download className="w-12 h-12 text-gray-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No offline songs</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Download tracks to listen without internet connection.
              </p>
            </div>
          ) : (
            downloadedTracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer"
              >
                <span className="w-6 text-xs text-gray-500 font-mono">{idx + 1}</span>
                <img src={track.cover_url || track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{track.title}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist_name || track.artist}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Create Custom Playlist */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#16161F] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-['Outfit']">Create New Playlist</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Playlist Title
                </label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Acoustic & Rock Favorites"
                  className="w-full bg-[#0B0B0E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#1DB954] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Description (Optional)
                </label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this playlist about?"
                  className="w-full bg-[#0B0B0E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#1DB954] outline-none h-20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-neon-green px-5 py-2 text-xs font-bold"
                >
                  Save Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
