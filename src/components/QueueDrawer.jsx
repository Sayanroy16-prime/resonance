import React, { useState } from 'react';
import { 
  X, 
  GripVertical, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  ListMusic, 
  CheckCircle 
} from 'lucide-react';

export const QueueDrawer = ({ 
  isOpen, 
  onClose, 
  currentTrack, 
  queue, 
  setQueue, 
  onPlayTrack,
  downloadedTrackIds
}) => {
  const [draggedIdx, setDraggedIdx] = useState(null);

  if (!isOpen) return null;

  const moveTrack = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= queue.length) return;
    const newQueue = [...queue];
    const [movedTrack] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, movedTrack);
    setQueue(newQueue);
  };

  const removeTrack = (index) => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
  };

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== targetIdx) {
      moveTrack(draggedIdx, targetIdx);
    }
    setDraggedIdx(null);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#12121A] border-l border-white/10 shadow-2xl z-30 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0B0B0E]/60">
        <div className="flex items-center gap-2.5">
          <ListMusic className="w-5 h-5 text-[#1DB954]" />
          <h2 className="text-base font-bold text-white font-['Outfit']">Play Queue</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Now Playing Section */}
        <div>
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3">
            Now Playing
          </h3>
          {currentTrack ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#1DB954]/15 to-transparent border border-[#1DB954]/30">
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="w-12 h-12 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
                <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
              </div>
              <div className="flex items-center gap-1">
                {downloadedTrackIds.includes(currentTrack.id) && (
                  <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                )}
                <div className="flex items-center gap-0.5 ml-1">
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No track playing</p>
          )}
        </div>

        {/* Up Next Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
              Next In Queue ({queue.length})
            </h3>
            {queue.length > 0 && (
              <button 
                onClick={() => setQueue([])}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition"
              >
                Clear Queue
              </button>
            )}
          </div>

          {queue.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-white/10 rounded-xl">
              <ListMusic className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-400 font-medium">Queue is currently empty</p>
              <p className="text-[11px] text-gray-600 mt-1">Add tracks from albums or search results!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`group flex items-center gap-2 p-2.5 rounded-lg bg-[#181822] hover:bg-[#222230] border border-white/5 transition-all ${
                    draggedIdx === idx ? 'opacity-40 border-dashed border-[#1DB954]' : ''
                  }`}
                >
                  <div className="drag-handle p-1 text-gray-500 group-hover:text-gray-300">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  
                  <img 
                    src={track.coverUrl} 
                    alt={track.title} 
                    className="w-10 h-10 rounded object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{track.title}</p>
                    <p className="text-[11px] text-gray-400 truncate">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveTrack(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveTrack(idx, idx + 1)}
                      disabled={idx === queue.length - 1}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onPlayTrack(track)}
                      className="p-1 text-[#1DB954] hover:scale-110 transition"
                      title="Play Now"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#1DB954]" />
                    </button>
                    <button
                      onClick={() => removeTrack(idx)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
