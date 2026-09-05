import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  Download, 
  CheckCircle, 
  ListMusic, 
  Maximize2 
} from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';

export const PlayerBar = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onSkipNext,
  onSkipPrev,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  isLiked,
  onToggleLike,
  isDownloaded,
  onToggleDownload,
  downloadProgress,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  onToggleQueue,
  queueCount,
  onExpandPlayer
}) => {
  const [sliderPos, setSliderPos] = useState(0);

  useEffect(() => {
    if (duration > 0) {
      setSliderPos((currentTime / duration) * 100);
    } else {
      setSliderPos(0);
    }
  }, [currentTime, duration]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setSliderPos(val);
    const targetSeconds = (val / 100) * duration;
    onSeek(targetSeconds);
  };

  return (
    <div className="h-24 px-8 glass-player flex items-center justify-between sticky bottom-0 z-30 select-none bg-[#0D0E10] border-t border-white/10">
      {/* Left: Track Info & Quick Actions */}
      <div className="flex items-center gap-4 w-1/4 min-w-[240px]">
        {currentTrack ? (
          <>
            <div className="relative group cursor-pointer flex-shrink-0" onClick={onExpandPlayer}>
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="w-14 h-14 rounded-xl object-cover shadow-xl border border-white/10"
              />
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 
                  onClick={onExpandPlayer}
                  className="text-xs font-extrabold text-white truncate cursor-pointer hover:text-[#00E676] transition"
                >
                  {currentTrack.title}
                </h4>
                {isDownloaded && <CheckCircle className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />}
              </div>
              <p className="text-[11px] text-[#8E929B] truncate mt-0.5">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onToggleLike}
                className={`p-1.5 rounded-full transition ${
                  isLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-gray-400 hover:text-white'
                }`}
                title={isLiked ? "Remove from Liked" : "Add to Liked"}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                onClick={onToggleDownload}
                className="p-1.5 rounded-full text-gray-400 hover:text-white transition relative"
                title={isDownloaded ? "Downloaded for Offline Play" : "Download to Offline Storage"}
              >
                {isDownloaded ? (
                  <CheckCircle className="w-4 h-4 text-[#00E676]" />
                ) : downloadProgress > 0 && downloadProgress < 100 ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-[#00E676] border-gray-600 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#14161A] border border-white/5 flex items-center justify-center">
              <ListMusic className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Select a track to play</p>
            </div>
          </div>
        )}
      </div>

      {/* Center: Playback Controls & Timeline Scrubber */}
      <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={onToggleShuffle}
            className={`p-1.5 rounded-full transition ${
              isShuffle ? 'text-[#00E676]' : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button 
            onClick={onSkipPrev}
            className="text-gray-300 hover:text-white transition hover:scale-110"
            title="Previous Track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button 
            onClick={onTogglePlay}
            className="w-11 h-11 rounded-full bg-[#00E676] text-black hover:bg-[#10FE84] flex items-center justify-center transition hover:scale-105 shadow-xl shadow-[#00E676]/30"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          <button 
            onClick={onSkipNext}
            className="text-gray-300 hover:text-white transition hover:scale-110"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button 
            onClick={onToggleRepeat}
            className={`p-1.5 rounded-full transition ${
              repeatMode !== 'off' ? 'text-[#00E676]' : 'text-gray-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode.toUpperCase()}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-bold text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderPos}
            onChange={handleSliderChange}
            className="scrub-bar flex-1"
          />
          <span className="text-[11px] font-bold text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Waveform, Queue & Volume Controls */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[240px]">
        <WaveformVisualizer isPlaying={isPlaying} />

        <button 
          onClick={onToggleQueue}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition relative"
          title="Open Queue"
        >
          <ListMusic className="w-5 h-5" />
          {queueCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00E676] text-black text-[10px] font-extrabold flex items-center justify-center">
              {queueCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleMute}
            className="text-gray-400 hover:text-white transition"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20 scrub-bar"
          />
        </div>
      </div>
    </div>
  );
};
