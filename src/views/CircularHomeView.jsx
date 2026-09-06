import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Search, Play, Pause, Heart, Download, CheckCircle, Plus,
  Disc3, X, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  ZoomIn, ZoomOut, Sparkles, Music, Flame, RotateCw
} from 'lucide-react';
import { MOCK_TRACKS } from '../data/mockTracks';

const ORBIT_R        = 230;
const ALBUM_D        = 76;
const CENTER_D       = 190;
const TICK_COUNT     = 72;
const WAVE_BAR_COUNT = 52;

const GENRE_PALETTES = {
  all: {
    id: 'all',
    label: 'All Vibes',
    icon: Sparkles,
    primary: '#00E676',
    secondary: '#00B0FF',
    accent: '#69F0AE',
    glow: 'rgba(0, 230, 118, 0.45)',
    bgGlow: 'rgba(0, 230, 118, 0.15)',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #0d1612 0%, #090A0C 75%)',
    description: 'All orbit & liked selections',
    filterFn: () => true,
  },
  pop: {
    id: 'pop',
    label: 'Pop',
    icon: Sparkles,
    primary: '#FF2A85',
    secondary: '#B5179E',
    accent: '#FF70A6',
    glow: 'rgba(255, 42, 133, 0.50)',
    bgGlow: 'rgba(255, 42, 133, 0.18)',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #1e0d17 0%, #090A0C 75%)',
    description: 'High-energy beats & chartbusters',
    filterFn: (t) => {
      const s = `${t.title} ${t.artist_name || t.artist} ${t.genre || ''}`.toLowerCase();
      return /pop|dance|party|funk|sheila|munni|dhanno|ainvayi|feels|ihls|cold|stars/i.test(s);
    },
  },
  jazz: {
    id: 'jazz',
    label: 'Jazz',
    icon: Music,
    primary: '#FFB300',
    secondary: '#FF7043',
    accent: '#FFE082',
    glow: 'rgba(255, 179, 0, 0.45)',
    bgGlow: 'rgba(255, 179, 0, 0.16)',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #1c150a 0%, #090A0C 75%)',
    description: 'Smooth brass, soul & acoustic ballads',
    filterFn: (t) => {
      const s = `${t.title} ${t.artist_name || t.artist} ${t.genre || ''}`.toLowerCase();
      return /jazz|blues|soul|ballad|slow|pee loon|awarapan|sadka|zindagi|bin tere/i.test(s);
    },
  },
  classic: {
    id: 'classic',
    label: 'Classic',
    icon: Disc3,
    primary: '#10B981',
    secondary: '#F59E0B',
    accent: '#6EE7B7',
    glow: 'rgba(16, 185, 129, 0.45)',
    bgGlow: 'rgba(16, 185, 129, 0.16)',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #0a1714 0%, #090A0C 75%)',
    description: 'Timeless melodies & symphony acoustic',
    filterFn: (t) => {
      const s = `${t.title} ${t.artist_name || t.artist} ${t.genre || ''}`.toLowerCase();
      return /classic|classical|symphony|orchestra|acoustic|tera hone|mast mast|tumko|saiyaara|chori|aadha ishq|sajde/i.test(s);
    },
  },
  rock: {
    id: 'rock',
    label: 'Rock',
    icon: Flame,
    primary: '#FF3D00',
    secondary: '#D50000',
    accent: '#FF9100',
    glow: 'rgba(255, 61, 0, 0.48)',
    bgGlow: 'rgba(255, 61, 0, 0.18)',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #1f0d0a 0%, #090A0C 75%)',
    description: 'Heavy electric riffs & Sufi power rock',
    filterFn: (t) => {
      const s = `${t.title} ${t.artist_name || t.artist} ${t.genre || ''}`.toLowerCase();
      return /rock|metal|electric|naadan|bulleya|aadat|toh phir aao|rishta|guitar/i.test(s);
    },
  },
};

const fmtTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

export const CircularHomeView = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  onSkipNext,
  onSkipPrev,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  likedTrackIds = [],
  onToggleLikeTrack,
  downloadedTrackIds = [],
  onDownloadTrack,
  onAddToQueue,
  currentTime = 0,
  duration = 0,
  onSeek,
  volume = 0.8,
  onVolumeChange,
  isMuted,
  onToggleMute,
  tracks = MOCK_TRACKS,
  allTracks = MOCK_TRACKS,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchOpen, setSearchOpen]       = useState(false);
  const [vinylAngle, setVinylAngle]       = useState(0);
  const [orbitAngle, setOrbitAngle]       = useState(0);
  const [wavePhase, setWavePhase]         = useState(0);
  const [deckZoom, setDeckZoom]           = useState(1.0);
  const [isOrbitAutoMoving, setIsOrbitAutoMoving] = useState(true);

  const inputRef    = useRef(null);
  const rafRef      = useRef(null);
  const lastTimeRef = useRef(null);

  const activeGenre = GENRE_PALETTES[selectedGenre] || GENRE_PALETTES.all;

  // Orbit rotation and soundwave phase animation loop
  useEffect(() => {
    const tick = (ts) => {
      if (lastTimeRef.current !== null) {
        const dt = ts - lastTimeRef.current;
        
        // Vinyl spin (spins when playing)
        if (isPlaying) {
          setVinylAngle(a => (a + dt * 0.024) % 360);
        }

        // Circular Orbit movement: continuous smooth movement
        if (isOrbitAutoMoving) {
          const orbitSpeed = isPlaying ? 0.016 : 0.007; // Degrees per millisecond
          setOrbitAngle(a => (a + dt * orbitSpeed) % 360);
        }

        // Waveform dynamic modulation phase
        const waveSpeed = isPlaying ? 0.0035 : 0.0012;
        setWavePhase(p => (p + dt * waveSpeed) % (Math.PI * 200));
      }
      lastTimeRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, isOrbitAutoMoving]);

  const toggleDeckZoom = useCallback(() => {
    setDeckZoom(z => (z === 1.0 ? 1.25 : z === 1.25 ? 1.5 : 1.0));
  }, []);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  // Filter tracks based on genre and liked status
  const displayedTracks = useMemo(() => {
    const sourceList = selectedGenre === 'all' 
      ? (tracks.length > 0 ? tracks : allTracks)
      : allTracks.filter(activeGenre.filterFn);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return sourceList.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.artist_name || t.artist || '').toLowerCase().includes(q) ||
        (t.genre || '').toLowerCase().includes(q)
      );
    }
    return sourceList;
  }, [tracks, allTracks, selectedGenre, activeGenre, searchQuery]);

  const totalSize = (ORBIT_R + ALBUM_D) * 2 + 24;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked      = currentTrack ? likedTrackIds.includes(currentTrack.id)      : false;
  const isDownloaded = currentTrack ? downloadedTrackIds.includes(currentTrack.id) : false;
  const ARC_R = cx - 10;
  const ARC_C = 2 * Math.PI * ARC_R;
  const offset = ARC_C - (progress / 100) * ARC_C;

  // Generate In-Between Radial Equalizer Waves (between Vinyl r=95 and Orbit r=230)
  const radialWaves = useMemo(() => {
    const bars = [];
    const rBase = 106; // Just outside the vinyl disc (r=95)
    for (let i = 0; i < WAVE_BAR_COUNT; i++) {
      const angle = (i / WAVE_BAR_COUNT) * 2 * Math.PI + (orbitAngle * Math.PI) / 360 - Math.PI / 2;
      
      // Real-time audio waveform mathematical simulation
      const harmonic1 = Math.sin(i * 0.42 + wavePhase * 4) * 0.5 + 0.5;
      const harmonic2 = Math.cos(i * 0.28 - wavePhase * 3) * 0.5 + 0.5;
      const harmonic3 = Math.sin(i * 0.85 + wavePhase * 6) * 0.5 + 0.5;
      
      const intensity = isPlaying ? (harmonic1 * 0.5 + harmonic2 * 0.3 + harmonic3 * 0.2) : 0.25;
      const maxH = 46; // Stays safely within r=106 to r=160
      const barHeight = 6 + intensity * maxH;
      
      const x1 = cx + rBase * Math.cos(angle);
      const y1 = cy + rBase * Math.sin(angle);
      const x2 = cx + (rBase + barHeight) * Math.cos(angle);
      const y2 = cy + (rBase + barHeight) * Math.sin(angle);

      bars.push({ x1, y1, x2, y2, intensity, index: i });
    }
    return bars;
  }, [cx, cy, orbitAngle, wavePhase, isPlaying]);

  // Generate In-Between Sine Wave Ribbon Paths (at r ≈ 140 to 180)
  const sineWavePath1 = useMemo(() => {
    const points = [];
    const steps = 72;
    const baseR = 146;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * 2 * Math.PI - Math.PI / 2;
      const waveMod = isPlaying 
        ? Math.sin(i * 0.52 + wavePhase * 3.5) * 9 + Math.cos(i * 0.26 - wavePhase * 2) * 5
        : Math.sin(i * 0.35 + wavePhase) * 3;
      const r = baseR + waveMod;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      points.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    points.push('Z');
    return points.join(' ');
  }, [cx, cy, wavePhase, isPlaying]);

  const sineWavePath2 = useMemo(() => {
    const points = [];
    const steps = 60;
    const baseR = 176;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * 2 * Math.PI - Math.PI / 2;
      const waveMod = isPlaying 
        ? Math.cos(i * 0.44 - wavePhase * 2.8) * 8 + Math.sin(i * 0.88 + wavePhase * 4) * 4
        : Math.cos(i * 0.28 - wavePhase * 0.8) * 2.5;
      const r = baseR + waveMod;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      points.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    points.push('Z');
    return points.join(' ');
  }, [cx, cy, wavePhase, isPlaying]);

  return (
    <div
      className="w-full h-full relative flex items-center justify-center overflow-hidden select-none transition-all duration-700"
      style={{ background: activeGenre.bgGradient }}
    >
      {/* Dynamic Ambient Background Glow shifting with Genre */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden transition-all duration-700">
        <div
          className="absolute rounded-full blur-3xl transition-all duration-700"
          style={{
            width: 580, height: 580, top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: `radial-gradient(circle, ${activeGenre.primary} 0%, transparent 70%)`,
            opacity: isPlaying ? 0.28 : 0.16,
          }}
        />
        <div
          className="absolute rounded-full blur-3xl transition-all duration-700"
          style={{
            width: 320, height: 320, top: '10%', left: '12%',
            background: activeGenre.secondary,
            opacity: 0.12,
          }}
        />
        <div
          className="absolute rounded-full blur-3xl transition-all duration-700"
          style={{
            width: 280, height: 280, bottom: '15%', right: '15%',
            background: activeGenre.accent,
            opacity: 0.10,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 max-w-full px-2">

        {/* ── TOP GENRE FILTER SELECTOR ── */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl z-40 transition-all duration-300">
          {Object.values(GENRE_PALETTES).map((genre) => {
            const isSel = selectedGenre === genre.id;
            const IconComp = genre.icon;
            return (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 relative group cursor-pointer"
                style={{
                  background: isSel ? genre.primary : 'transparent',
                  color: isSel ? '#000000' : 'rgba(255,255,255,0.7)',
                  boxShadow: isSel ? `0 0 16px ${genre.glow}, 0 2px 8px rgba(0,0,0,0.5)` : 'none',
                }}
              >
                <IconComp
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: isSel ? '#000000' : genre.primary }}
                />
                <span className="tracking-wide">{genre.label}</span>
                {isSel && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ background: '#000000' }}
                  />
                )}
              </button>
            );
          })}

          <div className="w-px h-4 bg-white/15 mx-1" />

          {/* Orbit Rotation Auto-Movement Toggle */}
          <button
            onClick={() => setIsOrbitAutoMoving(!isOrbitAutoMoving)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
            title={isOrbitAutoMoving ? "Pause Orbit Movement" : "Resume Orbit Movement"}
          >
            <RotateCw className={`w-3 h-3 ${isOrbitAutoMoving ? 'animate-spin text-[#00E676]' : 'text-gray-400'}`} style={{ animationDuration: '8s' }} />
            <span className="text-[10px] hidden sm:inline">{isOrbitAutoMoving ? 'Orbiting' : 'Paused'}</span>
          </button>
        </div>

        {/* ── MAIN INTERACTIVE ROW: LEFT LIST + BIG MOVING CIRCLE + RIGHT PLAYER ── */}
        <div className="flex items-center gap-5">

          {/* ── LEFT TRACK LIST ── */}
          <div className="w-48 flex flex-col gap-1 flex-shrink-0">
            <div className="flex items-center justify-between px-1 mb-2">
              <p
                className="text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-500"
                style={{ color: activeGenre.primary }}
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>{activeGenre.label} ({displayedTracks.length})</span>
              </p>
              <span className="text-[9px] text-gray-500 font-mono">
                {selectedGenre.toUpperCase()}
              </span>
            </div>

            <div className="space-y-0.5 max-h-[500px] overflow-y-auto pr-0.5 scrollbar-thin">
              {displayedTracks.length === 0 ? (
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[11px] font-bold text-gray-300">No songs match</p>
                  <p className="text-[9px] text-gray-500 mt-1">Try another genre or search.</p>
                </div>
              ) : (
                displayedTracks.map((track, idx) => {
                  const active = currentTrack?.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => onPlayTrack(track)}
                      className="group flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-left transition-all duration-300 cursor-pointer"
                      style={{
                        background: active ? `${activeGenre.primary}1A` : 'transparent',
                        border: `1px solid ${active ? `${activeGenre.primary}40` : 'transparent'}`,
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span
                        className="text-[10px] w-4 font-bold flex-shrink-0 transition-colors"
                        style={{ color: active ? activeGenre.primary : '#6b7280' }}
                      >
                        {active && isPlaying ? (
                          <span className="inline-flex gap-px items-end" style={{ height: 12 }}>
                            {[8, 12, 6].map((h, b) => (
                              <span
                                key={b}
                                className="w-px rounded-full"
                                style={{
                                  height: h,
                                  background: activeGenre.primary,
                                  animation: 'soundwave 1.2s ease-in-out infinite alternate',
                                  animationDelay: `${b * 0.15}s`,
                                }}
                              />
                            ))}
                          </span>
                        ) : (
                          idx + 1
                        )}
                      </span>
                      <img
                        src={track.cover_url || track.coverUrl}
                        alt=""
                        className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[11px] font-bold truncate transition-colors duration-300"
                          style={{ color: active ? activeGenre.primary : 'white' }}
                        >
                          {track.title}
                        </p>
                        <p className="text-[9px] text-gray-400 truncate">
                          {track.artist_name || track.artist}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── THE BIG CIRCLE & VINYL TURNTABLE ── */}
          <div
            className="relative flex-shrink-0 cursor-default"
            style={{
              width: totalSize,
              height: totalSize,
              transform: `scale(${deckZoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onDoubleClick={toggleDeckZoom}
            title="Double-click turntable to toggle Zoom"
          >
            {/* SVG: Dynamic Radial Waves, Harmonic Ribbons, Progress Arc, Moving Orbit Ring */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={totalSize}
              height={totalSize}
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Dynamic Genre Linear Gradient for Waves */}
                <linearGradient id="genreWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={activeGenre.primary} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={activeGenre.secondary} stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="genreRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={activeGenre.primary} stopOpacity="0.8" />
                  <stop offset="50%" stopColor={activeGenre.accent} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={activeGenre.secondary} stopOpacity="0.8" />
                </linearGradient>

                {/* Radial Disc Glow */}
                <radialGradient id="discAcousticGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor={activeGenre.primary} stopOpacity="0" />
                  <stop offset="85%" stopColor={activeGenre.primary} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={activeGenre.primary} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outer boundary circle */}
              <circle
                cx={cx} cy={cy} r={ARC_R} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth={1}
              />

              {/* Dynamic Progress Arc with Genre Color */}
              <circle
                cx={cx} cy={cy} r={ARC_R} fill="none"
                stroke={activeGenre.primary} strokeWidth={3.5} strokeLinecap="round"
                strokeDasharray={ARC_C} strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{
                  filter: `drop-shadow(0 0 8px ${activeGenre.primary})`,
                  transition: 'stroke 0.5s ease, stroke-dashoffset 0.4s linear',
                }}
              />

              {/* Rotating outer tick marks */}
              {Array.from({ length: TICK_COUNT }).map((_, i) => {
                const a   = (i / TICK_COUNT) * 2 * Math.PI + (orbitAngle * Math.PI) / 180 - Math.PI / 2;
                const big = i % (TICK_COUNT / 12) === 0;
                const r1  = ARC_R + 5;
                const r2  = r1 + (big ? 13 : 6);
                return (
                  <line
                    key={i}
                    x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
                    x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
                    stroke={big ? activeGenre.primary : 'rgba(255,255,255,0.08)'}
                    strokeWidth={big ? 1.6 : 0.8}
                    style={{ transition: 'stroke 0.5s ease' }}
                  />
                );
              })}

              {/* ── IN-BETWEEN SOUNDWAVES (Between Vinyl r=95 and Orbit r=230) ── */}

              {/* 1. Acoustic Radial Acoustic Glow Field */}
              <circle
                cx={cx} cy={cy} r={170}
                fill="url(#discAcousticGlow)"
              />

              {/* 2. Concentric Pulsing Soundwave Ripple Rings */}
              {[120, 150, 185].map((r, i) => (
                <circle
                  key={`ripple-${i}`}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={activeGenre.primary}
                  strokeWidth={1}
                  strokeDasharray={`${3 + i * 2} ${6 + i * 3}`}
                  strokeOpacity={isPlaying ? 0.22 - i * 0.05 : 0.08}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: `rotate(${(orbitAngle * (i % 2 === 0 ? 1 : -1) * 0.5) % 360}deg)`,
                    transition: 'stroke 0.5s ease, stroke-opacity 0.3s ease',
                  }}
                />
              ))}

              {/* 3. Radial Frequency Equalizer Wavebars in the annular region */}
              {radialWaves.map((bar, idx) => (
                <line
                  key={`wavebar-${idx}`}
                  x1={bar.x1} y1={bar.y1}
                  x2={bar.x2} y2={bar.y2}
                  stroke="url(#genreWaveGrad)"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  style={{
                    filter: bar.intensity > 0.6 ? `drop-shadow(0 0 4px ${activeGenre.primary})` : 'none',
                    opacity: 0.25 + bar.intensity * 0.75,
                    transition: 'stroke 0.4s ease',
                  }}
                />
              ))}

              {/* 4. Undulating Sine Wave Ribbon #1 */}
              <path
                d={sineWavePath1}
                fill="none"
                stroke="url(#genreRibbonGrad)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeOpacity={isPlaying ? 0.75 : 0.35}
                style={{
                  filter: `drop-shadow(0 0 6px ${activeGenre.primary})`,
                  transition: 'stroke 0.5s ease',
                }}
              />

              {/* 5. Undulating Sine Wave Ribbon #2 (Counter Harmonic) */}
              <path
                d={sineWavePath2}
                fill="none"
                stroke={activeGenre.secondary}
                strokeWidth={1.4}
                strokeDasharray="4 6"
                strokeOpacity={isPlaying ? 0.6 : 0.25}
                style={{
                  filter: `drop-shadow(0 0 4px ${activeGenre.secondary})`,
                  transition: 'stroke 0.5s ease',
                }}
              />

              {/* 6. Moving Planetary Orbit Ring */}
              <circle
                cx={cx} cy={cy} r={ORBIT_R} fill="none"
                stroke={activeGenre.primary}
                strokeWidth={1.2}
                strokeDasharray="4 10"
                strokeOpacity={0.25}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `rotate(${orbitAngle}deg)`,
                  transition: 'stroke 0.5s ease',
                }}
              />

              {/* 7. Active Connector Beam from Center Disc to Playing Track */}
              {currentTrack && displayedTracks.map((track, i) => {
                if (track.id !== currentTrack.id) return null;
                const a = displayedTracks.length > 1
                  ? (i / displayedTracks.length) * 2 * Math.PI + (orbitAngle * Math.PI) / 180 - Math.PI / 2
                  : -Math.PI / 2;
                return (
                  <g key="active-connector">
                    <line
                      x1={cx} y1={cy}
                      x2={cx + ORBIT_R * Math.cos(a)} y2={cy + ORBIT_R * Math.sin(a)}
                      stroke={activeGenre.primary}
                      strokeWidth={1.8}
                      strokeDasharray="6 6"
                      strokeOpacity={0.7}
                      style={{ filter: `drop-shadow(0 0 6px ${activeGenre.primary})` }}
                    />
                    <circle
                      cx={cx + (ORBIT_R * 0.5) * Math.cos(a)}
                      cy={cy + (ORBIT_R * 0.5) * Math.sin(a)}
                      r={3}
                      fill={activeGenre.accent}
                      style={{ filter: `drop-shadow(0 0 8px ${activeGenre.accent})` }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Empty State */}
            {displayedTracks.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none z-20">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: `${activeGenre.primary}1A`,
                    border: `1px solid ${activeGenre.primary}4D`,
                  }}
                >
                  <Heart className="w-7 h-7 fill-current animate-pulse" style={{ color: activeGenre.primary }} />
                </div>
                <p className="text-xs font-extrabold text-white">No Tracks in {activeGenre.label}</p>
                <p className="text-[10px] text-gray-400 max-w-[200px] mt-1">
                  Switch genre tabs above or tap ❤️ to add songs to orbit.
                </p>
              </div>
            )}

            {/* ── REVOLVING ALBUM THUMBNAILS (Moving dynamically with orbitAngle) ── */}
            {displayedTracks.map((track, i) => {
              const a = displayedTracks.length > 1
                ? (i / displayedTracks.length) * 2 * Math.PI + (orbitAngle * Math.PI) / 180 - Math.PI / 2
                : -Math.PI / 2;
              const left = cx + ORBIT_R * Math.cos(a) - ALBUM_D / 2;
              const top  = cy + ORBIT_R * Math.sin(a) - ALBUM_D / 2;
              const active = currentTrack?.id === track.id;
              const cover = track.cover_url || track.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
              const artist = track.artist_name || track.artist;

              return (
                <button
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className="absolute group focus:outline-none cursor-pointer"
                  style={{
                    left,
                    top,
                    width: ALBUM_D,
                    height: ALBUM_D,
                    zIndex: active ? 25 : 10,
                    transform: active ? 'scale(1.28)' : 'scale(1)',
                    transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  title={`${track.title} — ${artist}`}
                >
                  {active && (
                    <>
                      <div
                        className="absolute -inset-2 rounded-full border-2 animate-ping opacity-40"
                        style={{ borderColor: activeGenre.primary }}
                      />
                      <div
                        className="absolute -inset-1 rounded-full"
                        style={{ border: `2px solid ${activeGenre.primary}` }}
                      />
                    </>
                  )}
                  <img
                    src={cover}
                    alt={track.title}
                    className="w-full h-full rounded-full object-cover shadow-2xl"
                    style={{
                      border: active
                        ? `3px solid ${activeGenre.primary}`
                        : '2px solid rgba(255,255,255,0.14)',
                      boxShadow: active
                        ? `0 0 35px ${activeGenre.glow}, 0 8px 24px rgba(0,0,0,0.9)`
                        : '0 4px 16px rgba(0,0,0,0.7)',
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* Hover tooltip */}
                  <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                    style={{
                      left: '50%',
                      bottom: '112%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 shadow-2xl">
                      <p className="text-[10px] font-extrabold text-white">{track.title}</p>
                      <p className="text-[9px] text-gray-400">{artist}</p>
                    </div>
                  </div>

                  {/* Play icon hover overlay */}
                  {!active && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  )}
                </button>
              );
            })}

            {/* ── CENTER VINYL DISC & TURNTABLE ── */}
            <div
              className="absolute flex items-center justify-center rounded-full overflow-hidden transition-all duration-500"
              style={{
                left: cx - CENTER_D / 2,
                top: cy - CENTER_D / 2,
                width: CENTER_D,
                height: CENTER_D,
                background: 'radial-gradient(circle at 40% 35%, #1a1d24 0%, #0d0e10 60%, #090A0C 100%)',
                border: `1.5px solid ${activeGenre.primary}33`,
                boxShadow: `0 0 0 8px ${activeGenre.primary}0D, 0 0 70px rgba(0,0,0,0.95)`,
                zIndex: 30,
              }}
            >
              {/* Spinning vinyl record art */}
              {currentTrack && (
                <div
                  className="absolute inset-2 rounded-full overflow-hidden"
                  style={{ transform: `rotate(${vinylAngle}deg)` }}
                >
                  <img
                    src={currentTrack.coverUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-35"
                  />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `repeating-radial-gradient(circle at center,
                        transparent 18px, rgba(0,0,0,0.22) 19px,
                        transparent 20px, transparent 28px,
                        rgba(0,0,0,0.16) 29px, transparent 30px)`,
                    }}
                  />
                </div>
              )}

              {/* Center disc interactive controls / search */}
              {searchOpen ? (
                <div className="relative z-10 flex flex-col items-center gap-2 px-4 w-full">
                  <div className="flex items-center gap-1.5 w-full">
                    <Search style={{ width: 14, height: 14, color: activeGenre.primary, flexShrink: 0 }} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search songs..."
                      className="flex-1 bg-transparent text-white text-xs outline-none text-center"
                      style={{ caretColor: activeGenre.primary }}
                      onKeyDown={e => e.key === 'Escape' && closeSearch()}
                    />
                  </div>
                  <button
                    onClick={closeSearch}
                    className="text-gray-500 hover:text-gray-300 transition mt-0.5"
                  >
                    <X style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <button
                    onClick={openSearch}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
                    style={{
                      background: `${activeGenre.primary}1A`,
                      border: `1px solid ${activeGenre.primary}4D`,
                      boxShadow: `0 0 18px ${activeGenre.glow}`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${activeGenre.primary}33`;
                      e.currentTarget.style.boxShadow  = `0 0 28px ${activeGenre.glow}`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${activeGenre.primary}1A`;
                      e.currentTarget.style.boxShadow  = `0 0 18px ${activeGenre.glow}`;
                    }}
                  >
                    <Search style={{ width: 18, height: 18, color: activeGenre.primary }} />
                  </button>
                  {currentTrack ? (
                    <p className="text-[9px] font-extrabold text-white/80 text-center max-w-[110px] truncate">
                      {currentTrack.title}
                    </p>
                  ) : (
                    <p className="text-[9px] text-gray-500">Search</p>
                  )}
                </div>
              )}

              {/* Center vinyl spindle */}
              <div
                className="absolute w-3.5 h-3.5 rounded-full z-20 transition-all duration-500"
                style={{
                  background: activeGenre.primary,
                  boxShadow: `0 0 12px ${activeGenre.primary}`,
                }}
              />
            </div>

            {/* Search Dropdown */}
            {searchOpen && searchQuery && (
              <div
                className="absolute z-50"
                style={{ left: cx - 155, top: cy + CENTER_D / 2 + 14, width: 310 }}
              >
                <div
                  className="backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: 'rgba(13,14,16,0.97)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.9)',
                  }}
                >
                  <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">
                      {displayedTracks.length} result{displayedTracks.length !== 1 ? 's' : ''}
                    </p>
                    <button onClick={closeSearch}>
                      <X style={{ width: 13, height: 13, color: '#6b7280' }} />
                    </button>
                  </div>
                  {displayedTracks.length === 0 ? (
                    <p className="text-xs text-gray-500 p-4 text-center">No tracks found.</p>
                  ) : (
                    <div className="max-h-44 overflow-y-auto">
                      {displayedTracks.map(track => (
                        <button
                          key={track.id}
                          onClick={() => { onPlayTrack(track); closeSearch(); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 transition text-left"
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <img
                            src={track.coverUrl || track.cover_url}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{track.title}</p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {track.artist} · {track.genre}
                            </p>
                          </div>
                          {currentTrack?.id === track.id && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: activeGenre.primary }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deck Zoom & Motion Quick Controls */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141a]/95 border border-white/15 backdrop-blur-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setDeckZoom(z => Math.max(0.85, Math.round((z - 0.15) * 100) / 100))}
                disabled={deckZoom <= 0.85}
                className="p-1 rounded-full text-gray-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                title="Zoom Out Turntable"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleDeckZoom}
                className="flex items-center gap-1 text-[11px] font-bold px-1.5 hover:brightness-125 transition cursor-pointer"
                style={{ color: activeGenre.primary }}
                title="Toggle Zoom: 100% → 125% → 150%"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{Math.round(deckZoom * 100)}%</span>
              </button>
              <button
                onClick={() => setDeckZoom(z => Math.min(1.6, Math.round((z + 0.15) * 100) / 100))}
                disabled={deckZoom >= 1.6}
                className="p-1 rounded-full text-gray-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                title="Zoom In Turntable"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── RIGHT DETAILS PANEL ── */}
          <div className="w-60 flex flex-col gap-3 flex-shrink-0">

            {/* Now Playing card */}
            <div
              className="rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                background: 'rgba(14,16,20,0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}
            >
              {currentTrack ? (
                <>
                  <div className="relative w-full aspect-square">
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(14,16,20,1) 0%, rgba(14,16,20,0) 45%)',
                      }}
                    />
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md"
                      style={{
                        background: 'rgba(0,0,0,0.75)',
                        border: `1px solid ${activeGenre.primary}66`,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: activeGenre.primary,
                          animation: isPlaying ? 'pulse 1.5s ease-in-out infinite' : 'none',
                        }}
                      />
                      <span
                        className="text-[9px] font-extrabold uppercase tracking-widest"
                        style={{ color: activeGenre.primary }}
                      >
                        {isPlaying ? 'Playing' : 'Paused'}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pt-2 pb-4">
                    <h3 className="font-extrabold text-white text-sm leading-tight truncate">
                      {currentTrack.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{currentTrack.artist}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{currentTrack.album}</p>

                    {currentTrack.genre && (
                      <div className="mt-2">
                        <span
                          className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            color: activeGenre.primary,
                            background: `${activeGenre.primary}1A`,
                            border: `1px solid ${activeGenre.primary}33`,
                          }}
                        >
                          {currentTrack.genre}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onToggleLikeTrack(currentTrack.id)}
                        className="p-2 rounded-xl transition-all cursor-pointer"
                        style={{
                          background: isLiked ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isLiked ? 'rgba(244,63,94,0.35)' : 'transparent'}`,
                        }}
                      >
                        <Heart
                          style={{
                            width: 14, height: 14,
                            color: isLiked ? '#f43f5e' : '#9ca3af',
                            fill: isLiked ? '#f43f5e' : 'none',
                          }}
                        />
                      </button>
                      <button
                        onClick={() => onDownloadTrack(currentTrack)}
                        className="p-2 rounded-xl transition-all cursor-pointer"
                        style={{
                          background: isDownloaded ? `${activeGenre.primary}1A` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isDownloaded ? `${activeGenre.primary}40` : 'transparent'}`,
                        }}
                      >
                        {isDownloaded ? (
                          <CheckCircle style={{ width: 14, height: 14, color: activeGenre.primary }} />
                        ) : (
                          <Download style={{ width: 14, height: 14, color: '#9ca3af' }} />
                        )}
                      </button>
                      <button
                        onClick={() => onAddToQueue(currentTrack)}
                        className="p-2 rounded-xl transition-all hover:bg-white/10 cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <Plus style={{ width: 14, height: 14, color: '#9ca3af' }} />
                      </button>
                      <button
                        onClick={onTogglePlay}
                        className="ml-auto w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                        style={{
                          background: activeGenre.primary,
                          boxShadow: `0 0 20px ${activeGenre.glow}, 0 4px 16px rgba(0,0,0,0.5)`,
                        }}
                      >
                        {isPlaying ? (
                          <Pause style={{ width: 15, height: 15, fill: 'black', color: 'black' }} />
                        ) : (
                          <Play style={{ width: 15, height: 15, fill: 'black', color: 'black', marginLeft: 2 }} />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 flex flex-col items-center gap-3 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: `${activeGenre.primary}14`,
                      border: `1px solid ${activeGenre.primary}33`,
                    }}
                  >
                    <Disc3 style={{ width: 24, height: 24, color: activeGenre.primary }} />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Tap any album to start playing
                  </p>
                </div>
              )}
            </div>

            {/* Scrub bar & Full Player Controls */}
            <div
              className="rounded-2xl px-4 py-3"
              style={{
                background: 'rgba(14,16,20,0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Scrub bar */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-gray-400 w-7 text-right">
                  {fmtTime(currentTime)}
                </span>
                <div
                  className="flex-1 relative h-1 group cursor-pointer rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    onSeek?.((e.clientX - rect.left) / rect.width * duration);
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      background: activeGenre.primary,
                      boxShadow: `0 0 8px ${activeGenre.glow}`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    style={{ left: `calc(${progress}% - 5px)` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 w-7">
                  {fmtTime(duration)}
                </span>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onToggleShuffle}
                  className="p-1.5 rounded-lg transition cursor-pointer"
                  style={{ color: isShuffle ? activeGenre.primary : '#6b7280' }}
                >
                  <Shuffle style={{ width: 14, height: 14 }} />
                </button>
                <button onClick={onSkipPrev} className="hover:scale-110 transition text-gray-300 cursor-pointer">
                  <SkipBack style={{ width: 18, height: 18, fill: 'currentColor' }} />
                </button>
                <button
                  onClick={onTogglePlay}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition hover:scale-105 cursor-pointer"
                  style={{
                    background: activeGenre.primary,
                    boxShadow: `0 0 16px ${activeGenre.glow}`,
                  }}
                >
                  {isPlaying ? (
                    <Pause style={{ width: 14, height: 14, fill: 'black', color: 'black' }} />
                  ) : (
                    <Play style={{ width: 14, height: 14, fill: 'black', color: 'black', marginLeft: 2 }} />
                  )}
                </button>
                <button onClick={onSkipNext} className="hover:scale-110 transition text-gray-300 cursor-pointer">
                  <SkipForward style={{ width: 18, height: 18, fill: 'currentColor' }} />
                </button>
                <button
                  onClick={onToggleRepeat}
                  className="p-1.5 rounded-lg transition cursor-pointer"
                  style={{ color: repeatMode !== 'off' ? activeGenre.primary : '#6b7280' }}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 style={{ width: 14, height: 14 }} />
                  ) : (
                    <Repeat style={{ width: 14, height: 14 }} />
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={onToggleMute}
                  className="transition cursor-pointer"
                  style={{ color: (isMuted || volume === 0) ? '#f87171' : '#6b7280' }}
                >
                  {(isMuted || volume === 0) ? (
                    <VolumeX style={{ width: 13, height: 13 }} />
                  ) : (
                    <Volume2 style={{ width: 13, height: 13 }} />
                  )}
                </button>
                <div
                  className="flex-1 relative h-1 group cursor-pointer rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    onVolumeChange?.(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${(isMuted ? 0 : volume) * 100}%`,
                      background: activeGenre.primary,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span className="text-[9px] font-bold text-gray-500 w-6 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
