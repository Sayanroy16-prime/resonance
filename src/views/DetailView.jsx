import React from 'react';
import { Play, Pause, Shuffle, Download, CheckCircle, Heart, Plus, Clock } from 'lucide-react';
import { MOCK_TRACKS } from '../data/mockTracks';

export const DetailView = ({
  detailData, // { type: 'album' | 'playlist' | 'liked', title, description, coverUrl, tracks: [trackIds] }
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  onPlayAll,
  onShuffleAll,
  downloadedTrackIds,
  onDownloadTrack,
  onDownloadAll,
  likedTrackIds,
  onToggleLikeTrack,
  onAddToQueue
}) => {
  if (!detailData) return null;

  const tracks = (detailData.tracks || []).map(id => 
    typeof id === 'string' ? MOCK_TRACKS.find(t => t.id === id) : id
  ).filter(Boolean);

  const totalDurationSecs = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalDurationSecs / 60);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isAllDownloaded = tracks.length > 0 && tracks.every(t => downloadedTrackIds.includes(t.id));

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Banner with Dynamic Gradient Backdrop */}
      <div className="relative pt-12 px-8 pb-8 bg-gradient-to-b from-indigo-900/60 via-[#14141C] to-[#0B0B0E] flex flex-col sm:flex-row items-end gap-6 border-b border-white/5">
        <img 
          src={detailData.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'} 
          alt={detailData.title}
          className="w-48 h-48 rounded-2xl object-cover shadow-2xl border border-white/10 flex-shrink-0"
        />

        <div className="space-y-2 flex-1 min-w-0">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1DB954]">
            {detailData.type || 'PLAYLIST'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight truncate">
            {detailData.title}
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl line-clamp-2 mt-1">{detailData.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 font-medium">
            <span className="text-white font-bold">{detailData.author || 'Resonance'}</span>
            <span>•</span>
            <span>{tracks.length} songs,</span>
            <span>about {totalMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="px-8 flex items-center gap-5">
        <button
          onClick={() => onPlayAll(tracks)}
          className="btn-neon-green px-8 py-3.5 flex items-center gap-3 text-sm font-extrabold shadow-xl"
        >
          <Play className="w-5 h-5 fill-black" />
          <span>PLAY ALL</span>
        </button>

        <button
          onClick={() => onShuffleAll(tracks)}
          className="w-12 h-12 rounded-full bg-[#16161D] hover:bg-[#22222E] border border-white/10 text-white flex items-center justify-center transition hover:scale-105"
          title="Shuffle Play"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={() => onDownloadAll(tracks)}
          className={`w-12 h-12 rounded-full bg-[#16161D] hover:bg-[#22222E] border border-white/10 flex items-center justify-center transition hover:scale-105 ${
            isAllDownloaded ? 'text-[#1DB954]' : 'text-gray-300 hover:text-white'
          }`}
          title={isAllDownloaded ? "All tracks downloaded" : "Download All Tracks"}
        >
          {isAllDownloaded ? <CheckCircle className="w-5 h-5 text-[#1DB954]" /> : <Download className="w-5 h-5" />}
        </button>
      </div>

      {/* Tracks Table */}
      <div className="px-8">
        <div className="bg-[#14141B] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-xs text-gray-400">
            <thead className="bg-[#0F0F14] text-gray-500 font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Album</th>
                <th className="py-3.5 px-4 text-center"><Clock className="w-4 h-4 mx-auto" /></th>
                <th className="py-3.5 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const isPlayingThis = isCurrent && isPlaying;
                const isDownloaded = downloadedTrackIds.includes(track.id);
                const isLiked = likedTrackIds.includes(track.id);

                return (
                  <tr key={track.id} className="group hover:bg-[#1E1E28] transition-colors">
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

                    <td className="py-3 px-4 hidden md:table-cell text-gray-300 font-medium truncate">
                      {track.album}
                    </td>

                    <td className="py-3 px-4 text-center font-medium">
                      {formatDuration(track.duration)}
                    </td>

                    <td className="py-3 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onDownloadTrack(track)}
                          className="text-gray-400 hover:text-white transition"
                          title={isDownloaded ? "Downloaded" : "Download"}
                        >
                          {isDownloaded ? (
                            <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => onToggleLikeTrack(track.id)}
                          className={`transition ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-400 hover:text-white'}`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                        </button>

                        <button
                          onClick={() => onAddToQueue(track)}
                          className="text-gray-400 hover:text-white transition"
                          title="Add to Queue"
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
      </div>
    </div>
  );
};
