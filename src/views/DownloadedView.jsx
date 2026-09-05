import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Trash2, HardDrive, Play, Pause, ShieldCheck, WifiOff } from 'lucide-react';
import { getDownloadedTracks, clearAllOfflineCache, removeCachedTrack } from '../services/db';

export const DownloadedView = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  onCacheUpdated,
  isOfflineMode
}) => {
  const [downloadedItems, setDownloadedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDownloaded = async () => {
    try {
      const items = await getDownloadedTracks();
      setDownloadedItems(items);
    } catch (e) {
      console.error('Fetch downloaded err:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloaded();
  }, []);

  const handleRemoveTrack = async (trackId) => {
    await removeCachedTrack(trackId);
    await fetchDownloaded();
    onCacheUpdated();
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all offline cached audio?')) {
      await clearAllOfflineCache();
      await fetchDownloaded();
      onCacheUpdated();
    }
  };

  const totalSizeMB = downloadedItems.reduce((acc, curr) => acc + parseFloat(curr.sizeMB || 0), 0).toFixed(2);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-emerald-950/60 via-[#16161D] to-[#0B0B0E] rounded-2xl border border-[#1DB954]/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954]">
            <Download className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white font-['Outfit']">Offline Downloads</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-xs font-bold border border-[#1DB954]/30">
                IndexedDB
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Audio Blobs stored locally in browser storage for true offline playback without network access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400">Total Storage Used</p>
            <p className="text-xl font-extrabold text-[#1DB954]">{totalSizeMB} MB</p>
          </div>

          {downloadedItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          )}
        </div>
      </div>

      {/* Network Status Note */}
      {isOfflineMode && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold">Offline Simulator Active:</span> Playing tracks in this list will load binary Blobs directly from IndexedDB without internet streaming!
          </div>
        </div>
      )}

      {/* Cached Tracks Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading IndexedDB cache...</div>
      ) : downloadedItems.length === 0 ? (
        <div className="text-center py-16 bg-[#16161D] rounded-2xl border border-white/5 space-y-3">
          <HardDrive className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No tracks downloaded yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Click the download icon on any track row or album to save audio Blobs locally for offline playback!
          </p>
        </div>
      ) : (
        <div className="bg-[#14141B] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-xs text-gray-400">
            <thead className="bg-[#0F0F14] text-gray-500 font-bold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Track</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Cached Date</th>
                <th className="py-3.5 px-4 text-center">File Size</th>
                <th className="py-3.5 px-4 text-right pr-6">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {downloadedItems.map((item, idx) => {
                const track = item.trackData;
                const isCurrent = currentTrack?.id === track.id;
                const isPlayingThis = isCurrent && isPlaying;

                return (
                  <tr key={item.id} className="group hover:bg-[#1E1E28] transition-colors">
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
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-white">{track.title}</p>
                            <CheckCircle className="w-3.5 h-3.5 text-[#1DB954]" />
                          </div>
                          <p className="text-[11px] text-gray-400">{track.artist}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell text-gray-400">
                      {new Date(item.cachedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-[#1DB954]">
                      {item.sizeMB} MB
                    </td>

                    <td className="py-3 px-4 text-right pr-6">
                      <button
                        onClick={() => handleRemoveTrack(item.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 transition"
                        title="Delete from local cache"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
