import React, { useState } from 'react';
import { ChevronDown, Heart, Download, CheckCircle, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, Sparkles } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';

export const FullPlayerOverlay = ({
  isOpen,
  onClose,
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
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange
}) => {
  const [activeTab, setActiveTab] = useState('visualizer'); // 'visualizer' | 'lyrics'

  if (!isOpen || !currentTrack) return null;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0E] flex flex-col justify-between p-8 overflow-hidden select-none animate-in fade-in zoom-in-95 duration-300">
      {/* Ambient Backdrop Blur Image */}
      <div 
        className="absolute inset-0 opacity-20 blur-3xl scale-125 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex bg-[#16161F] p-1 rounded-full border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-4 py-1.5 rounded-full transition ${
              activeTab === 'visualizer' ? 'bg-[#1DB954] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Visualizer
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-4 py-1.5 rounded-full transition ${
              activeTab === 'lyrics' ? 'bg-[#1DB954] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Lyrics
          </button>
        </div>

        <div className="w-10" />
      </div>

      {/* Center Display: Album Art or Synchronized Lyrics */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-12 my-6">
        {/* High-Res Album Cover */}
        <div className="relative group">
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-3xl object-cover shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-300"
          />
          {isDownloaded && (
            <div className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur rounded-full">
              <CheckCircle className="w-6 h-6 text-[#1DB954]" />
            </div>
          )}
        </div>

        {/* Tab 1: Waveform Spectrum / Info */}
        {activeTab === 'visualizer' ? (
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-md">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1DB954]">NOW PLAYING</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] mt-1">
                {currentTrack.title}
              </h2>
              <p className="text-lg text-gray-300 font-semibold mt-1">{currentTrack.artist}</p>
              <p className="text-xs text-gray-500 mt-0.5">{currentTrack.album} • {currentTrack.genre}</p>
            </div>

            <WaveformVisualizer isPlaying={isPlaying} />

            <div className="flex items-center gap-4 pt-2">
              <button 
                onClick={onToggleLike}
                className={`p-3 rounded-full bg-white/5 hover:bg-white/10 transition ${
                  isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-300'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500' : ''}`} />
              </button>

              <button 
                onClick={onToggleDownload}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition"
              >
                {isDownloaded ? <CheckCircle className="w-6 h-6 text-[#1DB954]" /> : <Download className="w-6 h-6" />}
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: Lyrics Display */
          <div className="w-full max-w-lg bg-[#161622]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 h-80 overflow-y-auto space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/10 pb-2">
              Track Lyrics
            </h3>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-200">
              {currentTrack.lyrics || 'No lyrics available for this track.'}
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 max-w-2xl mx-auto w-full space-y-4">
        {/* Timeline Scrubber */}
        <div className="space-y-1">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progressPercent}
            onChange={(e) => onSeek((parseFloat(e.target.value) / 100) * duration)}
            className="scrub-bar w-full"
          />
          <div className="flex justify-between text-xs font-semibold text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onToggleShuffle}
            className={`p-2 rounded-full ${isShuffle ? 'text-[#1DB954]' : 'text-gray-400'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button onClick={onSkipPrev} className="text-gray-200 hover:text-white">
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button 
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl hover:scale-105 transition"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black ml-1" />}
          </button>

          <button onClick={onSkipNext} className="text-gray-200 hover:text-white">
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button 
            onClick={onToggleRepeat}
            className={`p-2 rounded-full ${repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-gray-400'}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
