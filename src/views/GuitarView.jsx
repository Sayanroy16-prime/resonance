import React, { useState, useEffect } from 'react';
import {
  Play, Pause, Heart, Download, CheckCircle,
  Plus, Guitar, Sliders, Volume2, Save, Check,
  X, Copy, FileText, Music, Sparkles,
  ZoomIn, ZoomOut, Maximize2, Minimize2
} from 'lucide-react';
import { GUITAR_TRACKS, GUITAR_CATEGORIES } from '../data/mockTracks';
import { api } from '../services/api';

const fmtTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

// Play reference tone using WebAudio Oscillator
const playReferenceTone = (freq) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle'; // rich harmonic content like a guitar string
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.8);
  } catch (e) {
    console.warn('AudioContext not allowed or supported:', e);
  }
};

// Animated string visualizer (decorative)
const StringVisualizer = ({ isPlaying }) => (
  <div className="flex items-center gap-1.5 h-8">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div
        key={i}
        className="h-full rounded-full"
        style={{
          width: 1.5,
          background: `rgba(251,146,60,${0.3 + (i * 0.1)})`,
          animation: isPlaying
            ? `soundwave ${0.8 + i * 0.12}s ease-in-out infinite alternate`
            : 'none',
          animationDelay: `${i * 0.08}s`,
          transformOrigin: 'center',
        }}
      />
    ))}
  </div>
);

// Fret diagram (decorative circular fretboard ring)
const FretRing = ({ size = 120, label, color }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 8;
  const strings = 6;
  const frets   = 5;

  return (
    <svg width={size} height={size} className="opacity-80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.3} />
      {Array.from({ length: frets }).map((_, f) => (
        <circle key={f} cx={cx} cy={cy}
                r={r * ((frets - f) / frets)}
                fill="none" stroke={color} strokeWidth={0.8} strokeOpacity={0.2} />
      ))}
      {Array.from({ length: strings }).map((_, s) => {
        const a  = (s / strings) * 2 * Math.PI - Math.PI / 2;
        return (
          <line key={s}
            x1={cx} y1={cy}
            x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
            stroke={color} strokeWidth={0.8} strokeOpacity={0.25} />
        );
      })}
      {[{ f: 0.55, s: 1 }, { f: 0.42, s: 3 }, { f: 0.7, s: 4 }].map((d, i) => {
        const a = (d.s / strings) * 2 * Math.PI - Math.PI / 2;
        return (
          <circle key={i}
            cx={cx + r * d.f * Math.cos(a)}
            cy={cy + r * d.f * Math.sin(a)}
            r={4} fill={color} fillOpacity={0.8}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        );
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize="9" fontFamily="Outfit,sans-serif" fontWeight="800"
            fillOpacity={0.9}>
        {label}
      </text>
    </svg>
  );
};

// Single track row
const TrackRow = ({
  track, index, isActive, isPlaying,
  onPlay, isLiked, onLike, isDownloaded, onDownload, onQueue, onOpenTab
}) => (
  <div
    className="flex items-center gap-3 px-4 py-2.5 rounded-xl group transition-all duration-200 cursor-pointer"
    style={{
      background: isActive ? 'rgba(251,146,60,0.1)' : 'transparent',
      border: `1px solid ${isActive ? 'rgba(251,146,60,0.3)' : 'transparent'}`,
    }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    onClick={() => onPlay(track)}
  >
    {/* index / play icon */}
    <div className="w-6 text-center text-xs text-gray-500 font-mono group-hover:hidden flex items-center justify-center">
      {isActive && isPlaying ? (
        <span className="flex items-center gap-0.5">
          <span className="w-1 h-3 rounded-full bg-orange-400 animate-pulse" />
          <span className="w-1 h-4 rounded-full bg-orange-400 animate-pulse" style={{ animationDelay: '0.15s' }} />
          <span className="w-1 h-2 rounded-full bg-orange-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </span>
      ) : (
        index + 1
      )}
    </div>
    <div className="w-6 text-center hidden group-hover:flex items-center justify-center">
      {isActive && isPlaying ? (
        <Pause style={{ width: 14, height: 14, color: '#fb923c' }} />
      ) : (
        <Play style={{ width: 14, height: 14, color: '#fb923c', marginLeft: 1 }} />
      )}
    </div>

    {/* cover thumbnail */}
    <img
      src={track.cover_url || track.coverUrl}
      alt={track.title}
      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
    />

    {/* title & artist */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold truncate leading-tight"
         style={{ color: isActive ? '#fb923c' : '#f3f4f6' }}>
        {track.title}
      </p>
      <p className="text-xs text-gray-400 truncate mt-0.5">{track.artist_name || track.artist}</p>
    </div>

    {/* Quick View Tab & Chords Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpenTab(track);
      }}
      className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 border border-orange-500/30 hover:border-orange-500 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400"
    >
      <FileText style={{ width: 11, height: 11 }} />
      <span>Chords & Tab</span>
    </button>

    {/* Tuning / Difficulty badge */}
    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
          style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c' }}>
      {track.tuning || 'Standard E'}
    </span>

    {/* genre badge */}
    <span className="hidden md:block w-28 text-xs text-gray-400 truncate">
      {track.category ? track.category.toUpperCase() : (track.genre || 'Guitar')}
    </span>

    {/* duration */}
    <span className="w-9 text-right text-xs text-gray-500 font-mono">
      {fmtTime(track.duration)}
    </span>

    {/* actions */}
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
         onClick={e => e.stopPropagation()}>
      <button
        onClick={() => onLike(track.id, isLiked)}
        className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
        title="Like Song"
      >
        <Heart style={{
          width: 14, height: 14,
          fill: isLiked ? '#ef4444' : 'none',
          color: isLiked ? '#ef4444' : 'currentColor'
        }} />
      </button>

      <button
        onClick={() => onDownload(track)}
        className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
        title="Download Offline"
      >
        {isDownloaded ? (
          <CheckCircle style={{ width: 14, height: 14, color: '#22c55e' }} />
        ) : (
          <Download style={{ width: 14, height: 14 }} />
        )}
      </button>

      <button
        onClick={() => onQueue(track)}
        className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white"
        title="Add to queue"
      >
        <Plus style={{ width: 14, height: 14 }} />
      </button>
    </div>
  </div>
);

export const GuitarView = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
  likedTrackIds = [],
  onToggleLikeTrack,
  downloadedTrackIds = [],
  onDownloadTrack,
  onAddToQueue,
}) => {
  const [tracks, setTracks] = useState(GUITAR_TRACKS);
  const [categories, setCategories] = useState(GUITAR_CATEGORIES);
  const [tunings, setTunings] = useState([]);
  const [selectedTuning, setSelectedTuning] = useState(null);
  const [pedals, setPedals] = useState([]);
  const [pedalStates, setPedalStates] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Guitar Tab & Chords Inspector Modal State
  const [selectedTabTrack, setSelectedTabTrack] = useState(null);
  const [currentTabDetails, setCurrentTabDetails] = useState(null);
  const [isTabModalOpen, setIsTabModalOpen] = useState(false);
  const [copiedTab, setCopiedTab] = useState(false);
  const [tabZoomLevel, setTabZoomLevel] = useState(1.0); // 1.0, 1.25, 1.5, 1.8
  const [isFullScreenTab, setIsFullScreenTab] = useState(false);

  const toggleTabZoom = () => {
    setTabZoomLevel(z => (z === 1.0 ? 1.25 : z === 1.25 ? 1.5 : z === 1.5 ? 1.8 : 1.0));
  };

  // Load live guitar catalog & tabs from backend
  useEffect(() => {
    let isMounted = true;
    const loadBackendData = async () => {
      try {
        const [liveTracks, liveCategories, liveTunings, livePedals] = await Promise.all([
          api.getGuitarTracks(),
          api.getGuitarCategories(),
          api.getGuitarTunings(),
          api.getGuitarPedals()
        ]);
        if (isMounted) {
          if (liveTracks && liveTracks.length > 0) setTracks(liveTracks);
          if (liveCategories && liveCategories.length > 0) setCategories(liveCategories);
          if (liveTunings && liveTunings.length > 0) {
            setTunings(liveTunings);
            setSelectedTuning(liveTunings[0]);
          }
          if (livePedals && livePedals.length > 0) {
            setPedals(livePedals);
            const initialMap = {};
            livePedals.forEach(p => {
              initialMap[p.id] = { enabled: true, ...p.controls?.reduce((acc, c) => ({ ...acc, [c.name]: c.default }), {}) };
            });
            setPedalStates(initialMap);
          }
          setBackendOnline(true);
        }
      } catch (err) {
        console.warn('Backend guitar fetch fallback to local:', err);
      }
    };
    loadBackendData();
    return () => { isMounted = false; };
  }, []);

  const handleOpenTab = async (track) => {
    setSelectedTabTrack(track);
    setIsTabModalOpen(true);
    try {
      const tab = await api.getGuitarTabs(track.id);
      if (tab) {
        setCurrentTabDetails(tab);
      } else {
        // Fallback default tab representation
        setCurrentTabDetails({
          title: `${track.title} Chords & Tab`,
          artist: track.artist_name || track.artist,
          tuning: track.tuning || 'Standard E',
          capo: 0,
          difficulty: track.difficulty || 'Intermediate',
          chords: ['Em', 'C', 'D', 'G'],
          tab_content: `Key: ${track.key_signature || 'Em'}\nTuning: ${track.tuning || 'Standard E'}\n\n[Intro Riff]\ne|---0-2-3--2-0-----|\nB|---------------3--|\n\nChords: Em - C - D - G`
        });
      }
    } catch (e) {
      console.warn('Failed to load tab:', e);
    }
  };

  const handleCopyTab = () => {
    if (!currentTabDetails) return;
    const textToCopy = `${currentTabDetails.title} by ${currentTabDetails.artist}\n\n${currentTabDetails.tab_content || currentTabDetails.tabContent}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTab(true);
    setTimeout(() => setCopiedTab(false), 2000);
  };

  const filteredTracks = activeCategory
    ? tracks.filter(t =>
        (t.category && t.category.toLowerCase() === activeCategory.toLowerCase()) ||
        categories.find(c => c.id === activeCategory)?.tracks?.includes(t.id)
      )
    : tracks;

  const featured = tracks[0] || GUITAR_TRACKS[0];

  const handleSavePreset = async () => {
    try {
      const payload = {
        name: `Studio Rig (${new Date().toLocaleTimeString()})`,
        amp_type: 'Tube Modern',
        gain: 0.7,
        pedals: Object.entries(pedalStates).map(([id, state]) => ({ id, ...state }))
      };
      const res = await api.saveGuitarPreset(payload);
      if (res.success || res.preset) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (e) {
      console.warn('Failed to save preset:', e);
    }
  };

  return (
    <div className="min-h-full pb-16 relative" style={{ background: '#090A0C' }}>

      {/* ── Hero Banner ── */}
      <div className="relative h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1400&auto=format&fit=crop&q=80"
          alt="Guitar"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        {/* layered gradients */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(6,4,2,0.97) 0%, rgba(6,4,2,0.80) 45%, rgba(6,4,2,0.2) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #090A0C 0%, transparent 50%)'
        }} />

        {/* decorative fret rings - floating behind text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-6 opacity-60 pointer-events-none">
          <FretRing size={90}  label="E" color="#f97316" />
          <FretRing size={120} label="Am" color="#fb923c" />
          <FretRing size={80}  label="G" color="#fdba74" />
        </div>

        {/* hero content */}
        <div className="relative h-full flex flex-col justify-end px-8 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
                 style={{ background: 'rgba(251,146,60,0.2)', border: '1px solid rgba(251,146,60,0.5)' }}>
              <Guitar style={{ width: 14, height: 14, color: '#fb923c' }} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: '#fb923c' }}>
              Guitar Studio Backend Live
            </span>
            {backendOnline && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API 2.0 CONNECTED
              </span>
            )}
          </div>
          <h1 className="font-extrabold text-white leading-none mb-3"
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 52,
                       textShadow: '0 4px 32px rgba(0,0,0,0.9)' }}>
            GUITAR
          </h1>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            Interactive chords, acoustic fingerpicking, overdrive solos & tabs. Featuring Phir Bhi Tumko Chahunga, Saiyaara, Tera Mera Rishta & classic studio masterworks.
          </p>

          {/* play featured */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => onPlayTrack(featured)}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-full font-extrabold text-sm transition-all hover:scale-105"
              style={{ background: '#fb923c', color: 'black',
                       boxShadow: '0 0 24px rgba(251,146,60,0.45)' }}
            >
              {(currentTrack?.id === featured.id && isPlaying)
                ? <><Pause style={{ width: 16, height: 16, fill: 'black' }} /> Pause</>
                : <><Play  style={{ width: 16, height: 16, fill: 'black', marginLeft: 1 }} /> Play All</>
              }
            </button>
            <StringVisualizer isPlaying={currentTrack?.id === featured?.id && isPlaying} />
          </div>
        </div>
      </div>

      <div className="px-8 pt-6 space-y-10">

        {/* ── Featured Indian & Acoustic Master Chords Cards ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles style={{ width: 18, height: 18, color: '#fb923c' }} />
              <h2 className="font-extrabold text-white text-base"
                  style={{ fontFamily: 'Outfit, sans-serif' }}>
                Featured Song Tabs & Chords
              </h2>
            </div>
            <span className="text-xs text-orange-400 font-bold">Interactive Tablature & Chords</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tracks.filter(t => ['track-phir-bhi-tumko', 'track-saiyaara', 'track-tera-mera-rishta'].includes(t.id)).map(song => (
              <div
                key={song.id}
                onClick={() => handleOpenTab(song)}
                className="p-5 rounded-2xl border border-white/10 flex flex-col justify-between cursor-pointer transition-all duration-300 group hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(251,146,60,0.12) 0%, rgba(20,20,28,0.7) 100%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {song.tuning || 'Standard E'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack(song);
                      }}
                      className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 text-black flex items-center justify-center transition-all shadow-md group-hover:scale-110"
                    >
                      {currentTrack?.id === song.id && isPlaying ? (
                        <Pause style={{ width: 14, height: 14, fill: 'black' }} />
                      ) : (
                        <Play style={{ width: 14, height: 14, fill: 'black', marginLeft: 1 }} />
                      )}
                    </button>
                  </div>
                  <h3 className="font-extrabold text-white text-base leading-tight group-hover:text-orange-400 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{song.artist_name || song.artist}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-orange-300 font-mono">
                    <FileText style={{ width: 14, height: 14 }} />
                    <span>View Chords & Tab</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500">{fmtTime(song.duration)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Category Selector (Circular-Themed Grid) ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-white"
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18 }}>
              Browse by Style
            </h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)}
                      className="text-xs font-bold transition hover:text-white"
                      style={{ color: '#fb923c' }}>
                Show All ({tracks.length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}
                  className="rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer transition-all duration-300 relative group"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(251,146,60,0.22) 0%, rgba(251,146,60,0.06) 100%)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'rgba(251,146,60,0.5)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isActive ? '0 0 20px rgba(251,146,60,0.2)' : 'none',
                    transform: isActive ? 'translateY(-2px)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: isActive ? '#fb923c' : 'rgba(251,146,60,0.12)',
                      color: isActive ? 'black' : '#fb923c',
                    }}
                  >
                    <Guitar style={{ width: 22, height: 22 }} />
                  </div>
                  <p className="text-xs font-extrabold text-white leading-tight mb-1">{cat.name}</p>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {cat.trackCount || cat.tracks?.length || 0} tracks
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Interactive Digital Guitar Tuner Reference ── */}
        {tunings.length > 0 && (
          <section className="p-6 rounded-2xl border border-white/10"
                   style={{ background: 'linear-gradient(135deg, rgba(30,20,10,0.6) 0%, rgba(15,15,20,0.8) 100%)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Volume2 style={{ width: 18, height: 18, color: '#fb923c' }} />
                  <h2 className="font-extrabold text-white text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Precision Guitar Tuner
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 text-orange-400">
                    440 Hz Pitch Standard
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Click any string button to play its reference Hz tone synthesized in real-time.
                </p>
              </div>

              {/* Tuning selector tabs */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                {tunings.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTuning(t)}
                    className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                      selectedTuning?.id === t.id
                        ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* String Buttons */}
            {selectedTuning && (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 mt-3">
                {selectedTuning.strings.map((str) => (
                  <button
                    key={str.name + str.stringNumber}
                    onClick={() => playReferenceTone(str.freq)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-orange-500/20 border border-white/5 hover:border-orange-500/40 transition-all group active:scale-95"
                  >
                    <span className="text-[10px] font-mono text-gray-400 mb-1">String {str.stringNumber}</span>
                    <span className="text-lg font-black text-white group-hover:text-orange-400 font-mono">
                      {str.name}
                    </span>
                    <span className="text-[10px] font-mono text-orange-400/80 mt-1">{str.freq.toFixed(1)} Hz</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Virtual Effects Pedalboard Studio ── */}
        {pedals.length > 0 && (
          <section className="p-6 rounded-2xl border border-white/10"
                   style={{ background: 'linear-gradient(135deg, rgba(20,15,30,0.6) 0%, rgba(12,12,18,0.8) 100%)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders style={{ width: 18, height: 18, color: '#8B5CF6' }} />
                  <h2 className="font-extrabold text-white text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Resonance Virtual Stompbox Rig
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Analog clipping, stereo tape delay, and convolution reverb. Synced with backend database.
                </p>
              </div>

              <button
                onClick={handleSavePreset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/30"
              >
                {savedSuccess ? (
                  <><Check style={{ width: 14, height: 14 }} /> Saved to Backend!</>
                ) : (
                  <><Save style={{ width: 14, height: 14 }} /> Save Rig Preset</>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pedals.map(pedal => {
                const state = pedalStates[pedal.id] || {};
                return (
                  <div
                    key={pedal.id}
                    className="p-4 rounded-xl border border-white/10 flex flex-col justify-between"
                    style={{ background: 'rgba(0,0,0,0.4)', borderTop: `3px solid ${pedal.color}` }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-white">{pedal.name}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                              style={{ background: `${pedal.color}25`, color: pedal.color }}>
                          {pedal.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3">{pedal.description}</p>
                    </div>

                    <div className="space-y-2 mt-2 pt-2 border-t border-white/5">
                      {pedal.controls?.map(ctrl => (
                        <div key={ctrl.name} className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 text-[11px]">{ctrl.label}</span>
                          <span className="font-mono text-gray-300 font-bold">
                            {state[ctrl.name] !== undefined ? state[ctrl.name] : ctrl.default}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Complete Track List with Tab Button ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-white"
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18 }}>
              {activeCategory
                ? `${categories.find(c => c.id === activeCategory)?.name || 'Filtered'} Tracks`
                : 'All Guitar Studio Tracks & Tabs'}
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              {filteredTracks.length} tracks
            </span>
          </div>

          {/* table header */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
            <span className="w-6 text-center">#</span>
            <span className="w-10" />
            <span className="flex-1">Title</span>
            <span className="w-28 text-center">Chords & Tab</span>
            <span className="hidden sm:inline-block w-24">Tuning</span>
            <span className="hidden md:block w-28">Category</span>
            <span className="w-9 text-right">Time</span>
            <span className="w-20" />
          </div>

          <div className="space-y-0.5 mt-1">
            {filteredTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                isActive={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                onPlay={onPlayTrack}
                isLiked={likedTrackIds.includes(track.id)}
                onLike={onToggleLikeTrack}
                isDownloaded={downloadedTrackIds.includes(track.id)}
                onDownload={onDownloadTrack}
                onQueue={onAddToQueue}
                onOpenTab={handleOpenTab}
              />
            ))}
          </div>
        </section>

      </div>

      {/* ── Interactive Guitar Tab & Chords Sheet Modal ── */}
      {isTabModalOpen && selectedTabTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`relative w-full ${isFullScreenTab ? 'max-w-5xl h-[92vh]' : 'max-w-2xl max-h-[85vh]'} rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl transition-all duration-300`}
            style={{ background: '#0e1014' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-orange-950/30 to-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <Guitar style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {selectedTabTrack.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedTabTrack.artist_name || selectedTabTrack.artist}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Tab Zoom Controller */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setTabZoomLevel(z => Math.max(0.85, Math.round((z - 0.15) * 100) / 100))}
                    disabled={tabZoomLevel <= 0.85}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition"
                    title="Zoom Out Tab (-)"
                  >
                    <ZoomOut style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    onClick={toggleTabZoom}
                    className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold text-orange-400 hover:bg-orange-500/10 transition"
                    title="Toggle Zoom: 100% → 125% → 150% → 180%"
                  >
                    {Math.round(tabZoomLevel * 100)}%
                  </button>
                  <button
                    onClick={() => setTabZoomLevel(z => Math.min(2.0, Math.round((z + 0.15) * 100) / 100))}
                    disabled={tabZoomLevel >= 2.0}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition"
                    title="Zoom In Tab (+)"
                  >
                    <ZoomIn style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                {/* Stage Mode / Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullScreenTab(!isFullScreenTab)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition"
                  title={isFullScreenTab ? "Exit Stage View" : "Stage Mode (Large View)"}
                >
                  {isFullScreenTab ? (
                    <Minimize2 style={{ width: 14, height: 14 }} />
                  ) : (
                    <Maximize2 style={{ width: 14, height: 14 }} />
                  )}
                </button>

                <button
                  onClick={handleCopyTab}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition"
                >
                  {copiedTab ? (
                    <><Check style={{ width: 14, height: 14, color: '#22c55e' }} /> Copied</>
                  ) : (
                    <><Copy style={{ width: 14, height: 14 }} /> Copy</>
                  )}
                </button>

                <button
                  onClick={() => setIsTabModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </div>

            {/* Modal Sub-meta bar */}
            <div className="px-6 py-3 bg-black/40 border-b border-white/5 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-gray-300">
                <span className="text-gray-500 font-mono">Tuning:</span>
                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-bold">
                  {selectedTabTrack.tuning || 'Standard E'}
                </span>
              </div>

              {currentTabDetails?.capo !== undefined && currentTabDetails.capo > 0 && (
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="text-gray-500 font-mono">Capo:</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                    Fret {currentTabDetails.capo}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-gray-300">
                <span className="text-gray-500 font-mono">Difficulty:</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-bold">
                  {selectedTabTrack.difficulty || 'Intermediate'}
                </span>
              </div>

              {selectedTabTrack.bpm && (
                <div className="flex items-center gap-1.5 text-gray-300 font-mono">
                  <span className="text-gray-500">Tempo:</span>
                  <span>{selectedTabTrack.bpm} BPM</span>
                </div>
              )}

              <button
                onClick={() => onPlayTrack(selectedTabTrack)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-orange-500 text-black hover:bg-orange-400 transition"
              >
                {currentTrack?.id === selectedTabTrack.id && isPlaying ? (
                  <><Pause style={{ width: 12, height: 12, fill: 'black' }} /> Playing</>
                ) : (
                  <><Play style={{ width: 12, height: 12, fill: 'black' }} /> Play Track</>
                )}
              </button>
            </div>

            {/* Chord Boxes with dynamic scale */}
            {currentTabDetails?.chords && currentTabDetails.chords.length > 0 && (
              <div className="px-6 py-3 bg-white/[0.02] border-b border-white/5 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
                  <Music style={{ width: 12, height: 12 }} /> Chords:
                </span>
                {currentTabDetails.chords.map((chord) => (
                  <span
                    key={chord}
                    className="font-extrabold tracking-wider bg-orange-500/15 text-orange-300 border border-orange-500/30 rounded-xl transition-all"
                    style={{
                      padding: `${4 * tabZoomLevel}px ${10 * tabZoomLevel}px`,
                      fontSize: `${11 * tabZoomLevel}px`
                    }}
                  >
                    {chord}
                  </span>
                ))}
              </div>
            )}

            {/* Modal Body: Monospace Tablature & Lyrics Sheet with Zoom Scaling */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <pre 
                className="font-mono leading-relaxed text-gray-300 bg-black/60 p-5 rounded-2xl border border-white/5 overflow-x-auto select-text whitespace-pre transition-all duration-200"
                style={{
                  fontSize: `${13 * tabZoomLevel}px`,
                  lineHeight: tabZoomLevel > 1.3 ? 1.75 : 1.6
                }}
              >
                {currentTabDetails?.tab_content || currentTabDetails?.tabContent || 'Loading tablature...'}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
