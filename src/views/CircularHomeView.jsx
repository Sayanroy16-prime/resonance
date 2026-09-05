import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search, Play, Pause, Heart, Download, CheckCircle, Plus,
  Disc3, X, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { MOCK_TRACKS } from '../data/mockTracks';

const ORBIT_R    = 230;
const ALBUM_D    = 76;
const CENTER_D   = 190;
const INNER_RING_R = 150;
const TICK_COUNT = 72;

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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen]   = useState(false);
  const [vinylAngle, setVinylAngle]   = useState(0);
  const [deckZoom, setDeckZoom]       = useState(1.0);

  const toggleDeckZoom = useCallback(() => {
    setDeckZoom(z => (z === 1.0 ? 1.25 : z === 1.25 ? 1.5 : 1.0));
  }, []);

  const inputRef    = useRef(null);
  const rafRef      = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }
    const tick = (ts) => {
      if (lastTimeRef.current !== null) {
        setVinylAngle(a => (a + (ts - lastTimeRef.current) * 0.018) % 360);
      }
      lastTimeRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  const filteredTracks = searchQuery.trim()
    ? tracks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.genre || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tracks;

  const totalSize = (ORBIT_R + ALBUM_D) * 2 + 24;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked      = currentTrack ? likedTrackIds.includes(currentTrack.id)      : false;
  const isDownloaded = currentTrack ? downloadedTrackIds.includes(currentTrack.id) : false;
  const ARC_R = cx - 10;
  const ARC_C = 2 * Math.PI * ARC_R;
  const offset = ARC_C - (progress / 100) * ARC_C;

  return (
    <div
      className="w-full h-full relative flex items-center justify-center overflow-hidden select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #0f1116 0%, #090A0C 70%)' }}
    >
      {/* ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full blur-3xl opacity-20"
             style={{ width: 500, height: 500, top: '50%', left: '50%',
                      transform: 'translate(-50%,-50%)',
                      background: 'radial-gradient(circle, #00E676 0%, transparent 70%)' }} />
        <div className="absolute rounded-full blur-3xl opacity-8"
             style={{ width: 280, height: 280, top: '15%', left: '15%', background: '#00E676' }} />
        <div className="absolute rounded-full blur-3xl opacity-6"
             style={{ width: 200, height: 200, bottom: '20%', right: '18%', background: '#6366f1' }} />
      </div>

      <div className="relative z-10 flex items-center gap-5 px-2">

        {/* ── LEFT TRACK LIST ── */}
        <div className="w-48 flex flex-col gap-1 flex-shrink-0">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-rose-400 mb-2 px-1 flex items-center gap-1.5">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>Liked Orbit ({tracks.length})</span>
          </p>
          <div className="space-y-0.5 max-h-[540px] overflow-y-auto pr-0.5">
            {tracks.length === 0 ? (
              <p className="text-[10px] text-gray-500 px-2 py-4 text-center">
                No liked songs yet.<br />Tap ❤️ on any song to add to orbit.
              </p>
            ) : (
              tracks.map((track, idx) => {
                const active = currentTrack?.id === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => onPlayTrack(track)}
                    className="group flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: active ? 'rgba(0,230,118,0.10)' : 'transparent',
                      border: `1px solid ${active ? 'rgba(0,230,118,0.22)' : 'transparent'}`,
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span className="text-[10px] w-4 font-bold flex-shrink-0"
                          style={{ color: active ? '#00E676' : '#4b5563' }}>
                      {active && isPlaying ? (
                        <span className="inline-flex gap-px items-end" style={{ height: 12 }}>
                          {[8,12,6].map((h, b) => (
                            <span key={b} className="w-px rounded-full"
                                  style={{ height: h, background: '#00E676',
                                           animation: 'soundwave 1.2s ease-in-out infinite alternate',
                                           animationDelay: `${b * 0.15}s` }} />
                          ))}
                        </span>
                      ) : idx + 1}
                    </span>
                    <img src={track.cover_url || track.coverUrl} alt=""
                         className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate"
                         style={{ color: active ? '#00E676' : 'white' }}>{track.title}</p>
                      <p className="text-[9px] text-gray-500 truncate">{track.artist_name || track.artist}</p>
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
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onDoubleClick={toggleDeckZoom}
          title="Double-click turntable to toggle Zoom"
        >

          {/* SVG: rings, ticks, arc, connectors */}
          <svg className="absolute inset-0" width={totalSize} height={totalSize} style={{ overflow: 'visible' }}>
            {/* outer border */}
            <circle cx={cx} cy={cy} r={ARC_R} fill="none"
                    stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            {/* progress arc */}
            <circle cx={cx} cy={cy} r={ARC_R} fill="none"
                    stroke="#00E676" strokeWidth={3} strokeLinecap="round"
                    strokeDasharray={ARC_C} strokeDashoffset={offset}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0,230,118,0.7))',
                             transition: 'stroke-dashoffset 0.4s linear' }} />
            {/* tick marks */}
            {Array.from({ length: TICK_COUNT }).map((_, i) => {
              const a   = (i / TICK_COUNT) * 2 * Math.PI - Math.PI / 2;
              const big = i % (TICK_COUNT / 12) === 0;
              const r1  = ARC_R + 5;
              const r2  = r1 + (big ? 13 : 6);
              return (
                <line key={i}
                  x1={cx + r1*Math.cos(a)} y1={cy + r1*Math.sin(a)}
                  x2={cx + r2*Math.cos(a)} y2={cy + r2*Math.sin(a)}
                  stroke={big ? 'rgba(0,230,118,0.5)' : 'rgba(255,255,255,0.07)'}
                  strokeWidth={big ? 1.5 : 0.8} />
              );
            })}
            {/* orbit ring */}
            <circle cx={cx} cy={cy} r={ORBIT_R} fill="none"
                    stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="3 9" />
            {/* inner groove rings */}
            {[INNER_RING_R, INNER_RING_R-22, INNER_RING_R-44].map((r, i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                      stroke={`rgba(0,230,118,${0.06 - i*0.015})`} strokeWidth={1} />
            ))}
            {/* clock labels */}
            {[0,90,180,270].map((deg, i) => {
              const a  = (deg - 90) * Math.PI / 180;
              const lr = ARC_R + 24;
              return (
                <text key={i} x={cx+lr*Math.cos(a)} y={cy+lr*Math.sin(a)}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="rgba(255,255,255,0.12)" fontSize="8"
                      fontFamily="Outfit,sans-serif" fontWeight="700">
                  {['12','3','6','9'][i]}
                </text>
              );
            })}
            {/* active connector line */}
            {currentTrack && tracks.map((track, i) => {
              if (track.id !== currentTrack.id) return null;
              const a = tracks.length > 1 ? (i / tracks.length) * 2 * Math.PI - Math.PI / 2 : -Math.PI / 2;
              return (
                <line key="conn"
                  x1={cx} y1={cy}
                  x2={cx + ORBIT_R*Math.cos(a)} y2={cy + ORBIT_R*Math.sin(a)}
                  stroke="rgba(0,230,118,0.3)" strokeWidth={1} strokeDasharray="5 8" />
              );
            })}
          </svg>

          {/* Empty Orbit State */}
          {tracks.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none z-20">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-3">
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20 animate-pulse" />
              </div>
              <p className="text-xs font-extrabold text-white">Your Orbit is Empty</p>
              <p className="text-[10px] text-gray-400 max-w-[200px] mt-1">
                Tap ❤️ on songs in Search or Library to populate your home wheel.
              </p>
            </div>
          )}

          {/* album orbit thumbnails */}
          {tracks.map((track, i) => {
            const a    = tracks.length > 1 ? (i / tracks.length) * 2 * Math.PI - Math.PI / 2 : -Math.PI / 2;
            const left = cx + ORBIT_R * Math.cos(a) - ALBUM_D / 2;
            const top  = cy + ORBIT_R * Math.sin(a) - ALBUM_D / 2;
            const active = currentTrack?.id === track.id;
            const cover = track.cover_url || track.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
            const artist = track.artist_name || track.artist;
            return (
              <button
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className="absolute group focus:outline-none"
                style={{
                  left, top, width: ALBUM_D, height: ALBUM_D,
                  zIndex: active ? 20 : 5,
                  transform: active ? 'scale(1.28)' : 'scale(1)',
                  transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                }}
                title={`${track.title} — ${artist}`}
              >
                {active && (
                  <>
                    <div className="absolute -inset-2 rounded-full border-2 border-[#00E676] animate-ping opacity-40" />
                    <div className="absolute -inset-1 rounded-full"
                         style={{ border: '1.5px solid rgba(0,230,118,0.7)' }} />
                  </>
                )}
                <img src={cover} alt={track.title}
                     className="w-full h-full rounded-full object-cover"
                     style={{
                       border: active ? '2.5px solid #00E676' : '2px solid rgba(255,255,255,0.10)',
                       boxShadow: active
                         ? '0 0 30px rgba(0,230,118,0.55), 0 8px 24px rgba(0,0,0,0.8)'
                         : '0 4px 16px rgba(0,0,0,0.6)',
                       transition: 'all 0.3s ease',
                     }} />
                {/* hover tooltip */}
                <div className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                     style={{ left: '50%', bottom: '112%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                  <div className="bg-black/90 backdrop-blur border border-white/10 rounded-xl px-2.5 py-1.5 shadow-xl">
                    <p className="text-[10px] font-extrabold text-white">{track.title}</p>
                    <p className="text-[9px] text-gray-400">{artist}</p>
                  </div>
                </div>
                {/* play icon overlay */}
                {!active && (
                  <div className="absolute inset-0 rounded-full bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                )}
              </button>
            );
          })}

          {/* CENTER VINYL DISC */}
          <div
            className="absolute flex items-center justify-center rounded-full overflow-hidden"
            style={{
              left: cx - CENTER_D/2, top: cy - CENTER_D/2,
              width: CENTER_D, height: CENTER_D,
              background: 'radial-gradient(circle at 40% 35%, #1a1d24 0%, #0d0e10 60%, #090A0C 100%)',
              border: '1.5px solid rgba(0,230,118,0.18)',
              boxShadow: '0 0 0 8px rgba(0,230,118,0.04), 0 0 80px rgba(0,0,0,0.9)',
              zIndex: 30,
            }}
          >
            {/* spinning vinyl art */}
            {currentTrack && (
              <div className="absolute inset-2 rounded-full overflow-hidden"
                   style={{ transform: `rotate(${vinylAngle}deg)` }}>
                <img src={currentTrack.coverUrl} alt=""
                     className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 rounded-full"
                     style={{
                       background: `repeating-radial-gradient(circle at center,
                         transparent 18px, rgba(0,0,0,0.22) 19px,
                         transparent 20px, transparent 28px,
                         rgba(0,0,0,0.16) 29px, transparent 30px)`,
                     }} />
              </div>
            )}

            {/* center content */}
            {searchOpen ? (
              <div className="relative z-10 flex flex-col items-center gap-2 px-4 w-full">
                <div className="flex items-center gap-1.5 w-full">
                  <Search style={{ width: 14, height: 14, color: '#00E676', flexShrink: 0 }} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent text-white text-xs outline-none text-center"
                    style={{ caretColor: '#00E676' }}
                    onKeyDown={e => e.key === 'Escape' && closeSearch()}
                  />
                </div>
                <button onClick={closeSearch}
                        className="text-gray-600 hover:text-gray-300 transition mt-0.5">
                  <X style={{ width: 12, height: 12 }} />
                </button>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center gap-2">
                <button
                  onClick={openSearch}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'rgba(0,230,118,0.08)',
                    border: '1px solid rgba(0,230,118,0.22)',
                    boxShadow: '0 0 18px rgba(0,230,118,0.12)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background  = 'rgba(0,230,118,0.18)';
                    e.currentTarget.style.boxShadow   = '0 0 28px rgba(0,230,118,0.35)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background  = 'rgba(0,230,118,0.08)';
                    e.currentTarget.style.boxShadow   = '0 0 18px rgba(0,230,118,0.12)';
                  }}
                >
                  <Search style={{ width: 18, height: 18, color: '#00E676' }} />
                </button>
                {currentTrack ? (
                  <p className="text-[9px] font-extrabold text-white/70 text-center max-w-[110px] truncate">
                    {currentTrack.title}
                  </p>
                ) : (
                  <p className="text-[9px] text-gray-600">Search</p>
                )}
              </div>
            )}

            {/* center spindle */}
            <div className="absolute w-3 h-3 rounded-full z-20"
                 style={{ background: '#00E676', boxShadow: '0 0 10px rgba(0,230,118,0.9)' }} />
          </div>

          {/* search dropdown (appears below the disc) */}
          {searchOpen && searchQuery && (
            <div className="absolute z-50"
                 style={{ left: cx - 155, top: cy + CENTER_D/2 + 14, width: 310 }}>
              <div className="backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl"
                   style={{ background: 'rgba(13,14,16,0.97)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}>
                <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500">
                    {filteredTracks.length} result{filteredTracks.length !== 1 ? 's' : ''}
                  </p>
                  <button onClick={closeSearch}>
                    <X style={{ width: 13, height: 13, color: '#6b7280' }} />
                  </button>
                </div>
                {filteredTracks.length === 0 ? (
                  <p className="text-xs text-gray-500 p-4 text-center">No tracks found.</p>
                ) : (
                  <div className="max-h-44 overflow-y-auto">
                    {filteredTracks.map(track => (
                      <button key={track.id}
                        onClick={() => { onPlayTrack(track); closeSearch(); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 transition text-left"
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <img src={track.coverUrl} alt=""
                             className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{track.title}</p>
                          <p className="text-[10px] text-gray-500 truncate">{track.artist} · {track.genre}</p>
                        </div>
                        {currentTrack?.id === track.id && (
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                               style={{ background: '#00E676' }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Deck Zoom Quick Controls */}
          <div 
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141a]/90 border border-white/15 backdrop-blur-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setDeckZoom(z => Math.max(0.85, Math.round((z - 0.15) * 100) / 100))}
              disabled={deckZoom <= 0.85}
              className="p-1 rounded-full text-gray-400 hover:text-white disabled:opacity-30 transition"
              title="Zoom Out Turntable"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleDeckZoom}
              className="flex items-center gap-1 text-[11px] font-bold text-[#00E676] px-1.5 hover:brightness-125 transition"
              title="Toggle Zoom: 100% → 125% → 150%"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{Math.round(deckZoom * 100)}%</span>
              <span className="text-[9px] text-gray-400 font-normal hidden sm:inline">Deck Zoom</span>
            </button>
            <button
              onClick={() => setDeckZoom(z => Math.min(1.6, Math.round((z + 0.15) * 100) / 100))}
              disabled={deckZoom >= 1.6}
              className="p-1 rounded-full text-gray-400 hover:text-white disabled:opacity-30 transition"
              title="Zoom In Turntable"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── RIGHT DETAILS PANEL ── */}
        <div className="w-60 flex flex-col gap-3 flex-shrink-0">

          {/* Now Playing */}
          <div className="rounded-2xl overflow-hidden"
               style={{ background: 'rgba(14,16,20,0.88)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(24px)' }}>
            {currentTrack ? (
              <>
                <div className="relative w-full aspect-square">
                  <img src={currentTrack.coverUrl} alt={currentTrack.title}
                       className="w-full h-full object-cover" />
                  <div className="absolute inset-0"
                       style={{ background: 'linear-gradient(to top, rgba(14,16,20,1) 0%, rgba(14,16,20,0) 45%)' }} />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
                       style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,230,118,0.3)' }}>
                    <div className="w-1.5 h-1.5 rounded-full"
                         style={{ background: '#00E676',
                                  animation: isPlaying ? 'pulse 1.5s ease-in-out infinite' : 'none' }} />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest"
                          style={{ color: '#00E676' }}>
                      {isPlaying ? 'Playing' : 'Paused'}
                    </span>
                  </div>
                </div>
                <div className="px-4 pt-2 pb-4">
                  <h3 className="font-extrabold text-white text-sm leading-tight truncate">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{currentTrack.artist}</p>
                  <p className="text-[10px] text-gray-600 truncate mt-0.5">{currentTrack.album}</p>
                  {currentTrack.genre && (
                    <div className="mt-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ color: '#00E676',
                                     background: 'rgba(0,230,118,0.10)',
                                     border: '1px solid rgba(0,230,118,0.2)' }}>
                        {currentTrack.genre}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => onToggleLikeTrack(currentTrack.id)}
                            className="p-2 rounded-xl transition-all"
                            style={{ background: isLiked ? 'rgba(244,63,94,0.12)' : 'rgba(255,255,255,0.05)',
                                     border: `1px solid ${isLiked ? 'rgba(244,63,94,0.3)' : 'transparent'}` }}>
                      <Heart style={{ width: 14, height: 14,
                                      color: isLiked ? '#f43f5e' : '#9ca3af',
                                      fill: isLiked ? '#f43f5e' : 'none' }} />
                    </button>
                    <button onClick={() => onDownloadTrack(currentTrack)}
                            className="p-2 rounded-xl transition-all"
                            style={{ background: isDownloaded ? 'rgba(0,230,118,0.10)' : 'rgba(255,255,255,0.05)',
                                     border: `1px solid ${isDownloaded ? 'rgba(0,230,118,0.25)' : 'transparent'}` }}>
                      {isDownloaded
                        ? <CheckCircle style={{ width: 14, height: 14, color: '#00E676' }} />
                        : <Download    style={{ width: 14, height: 14, color: '#9ca3af' }} />}
                    </button>
                    <button onClick={() => onAddToQueue(currentTrack)}
                            className="p-2 rounded-xl transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Plus style={{ width: 14, height: 14, color: '#9ca3af' }} />
                    </button>
                    <button onClick={onTogglePlay}
                            className="ml-auto w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
                            style={{ background: '#00E676',
                                     boxShadow: '0 0 20px rgba(0,230,118,0.4), 0 4px 16px rgba(0,0,0,0.5)' }}>
                      {isPlaying
                        ? <Pause style={{ width: 15, height: 15, fill: 'black', color: 'black' }} />
                        : <Play  style={{ width: 15, height: 15, fill: 'black', color: 'black', marginLeft: 2 }} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                     style={{ background: 'rgba(0,230,118,0.06)',
                              border: '1px solid rgba(0,230,118,0.15)' }}>
                  <Disc3 style={{ width: 24, height: 24, color: '#374151' }} />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tap any album to start playing
                </p>
              </div>
            )}
          </div>

          {/* Player Controls */}
          <div className="rounded-2xl px-4 py-3"
               style={{ background: 'rgba(14,16,20,0.88)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(24px)' }}>
            {/* scrub bar */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-gray-500 w-7 text-right">{fmtTime(currentTime)}</span>
              <div className="flex-1 relative h-1 group cursor-pointer rounded-full"
                   style={{ background: 'rgba(255,255,255,0.10)' }}
                   onClick={e => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     onSeek?.((e.clientX - rect.left) / rect.width * duration);
                   }}>
                <div className="absolute inset-y-0 left-0 rounded-full"
                     style={{ width: `${progress}%`, background: '#00E676',
                              boxShadow: '0 0 8px rgba(0,230,118,0.6)' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white
                                opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                     style={{ left: `calc(${progress}% - 5px)` }} />
              </div>
              <span className="text-[10px] font-bold text-gray-500 w-7">{fmtTime(duration)}</span>
            </div>
            {/* control buttons */}
            <div className="flex items-center justify-between">
              <button onClick={onToggleShuffle} className="p-1.5 rounded-lg transition"
                      style={{ color: isShuffle ? '#00E676' : '#6b7280' }}>
                <Shuffle style={{ width: 14, height: 14 }} />
              </button>
              <button onClick={onSkipPrev} className="hover:scale-110 transition"
                      style={{ color: '#d1d5db' }}>
                <SkipBack style={{ width: 18, height: 18, fill: 'currentColor' }} />
              </button>
              <button onClick={onTogglePlay}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition hover:scale-105"
                      style={{ background: '#00E676', boxShadow: '0 0 16px rgba(0,230,118,0.35)' }}>
                {isPlaying
                  ? <Pause style={{ width: 14, height: 14, fill: 'black', color: 'black' }} />
                  : <Play  style={{ width: 14, height: 14, fill: 'black', color: 'black', marginLeft: 2 }} />}
              </button>
              <button onClick={onSkipNext} className="hover:scale-110 transition"
                      style={{ color: '#d1d5db' }}>
                <SkipForward style={{ width: 18, height: 18, fill: 'currentColor' }} />
              </button>
              <button onClick={onToggleRepeat} className="p-1.5 rounded-lg transition"
                      style={{ color: repeatMode !== 'off' ? '#00E676' : '#6b7280' }}>
                {repeatMode === 'one'
                  ? <Repeat1 style={{ width: 14, height: 14 }} />
                  : <Repeat  style={{ width: 14, height: 14 }} />}
              </button>
            </div>
            {/* volume */}
            <div className="flex items-center gap-2 mt-2.5">
              <button onClick={onToggleMute} className="transition"
                      style={{ color: (isMuted || volume === 0) ? '#f87171' : '#6b7280' }}>
                {(isMuted || volume === 0)
                  ? <VolumeX style={{ width: 13, height: 13 }} />
                  : <Volume2 style={{ width: 13, height: 13 }} />}
              </button>
              <div className="flex-1 relative h-1 group cursor-pointer rounded-full"
                   style={{ background: 'rgba(255,255,255,0.10)' }}
                   onClick={e => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     onVolumeChange?.(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
                   }}>
                <div className="absolute inset-y-0 left-0 rounded-full"
                     style={{ width: `${(isMuted ? 0 : volume) * 100}%`,
                              background: 'rgba(0,230,118,0.6)' }} />
              </div>
              <span className="text-[9px] font-bold text-gray-600 w-6 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
