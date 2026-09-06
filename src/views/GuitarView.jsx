import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play, Pause, Heart, Download, CheckCircle,
  Plus, Guitar, Sliders, Volume2, Save, Check,
  X, Copy, FileText, Music, Sparkles,
  ZoomIn, ZoomOut, Maximize2, Minimize2,
  ArrowDown, ArrowUp, RotateCcw, Volume1, Clock,
  PlayCircle, PauseCircle, ChevronRight, Share2, Layers
} from 'lucide-react';
import { GUITAR_TRACKS, GUITAR_CATEGORIES } from '../data/mockTracks';
import { api } from '../services/api';

const fmtTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

// ─── Music Theory & Transposition Engine ──────────────────────────────────────
const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const NORMALIZE_MAP = {
  'B#': 'C', 'Cb': 'B', 'E#': 'F', 'Fb': 'E',
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
};

export const transposeChord = (chord, semitones) => {
  if (!chord || semitones === 0) return chord;
  // Support slash chords e.g. D/F#
  if (chord.includes('/')) {
    const [main, bass] = chord.split('/');
    return `${transposeChord(main, semitones)}/${transposeChord(bass, semitones)}`;
  }

  // Parse root and quality
  const match = chord.match(/^([A-G][b#]?)(.*)/);
  if (!match) return chord;
  let [, root, suffix] = match;

  const normalized = NORMALIZE_MAP[root] || root;
  const isFlat = root.includes('b');
  const scale = isFlat ? CHROMATIC_FLAT : CHROMATIC_SHARP;

  let idx = CHROMATIC_SHARP.indexOf(normalized);
  if (idx === -1) idx = CHROMATIC_FLAT.indexOf(root);
  if (idx === -1) return chord;

  let newIdx = (idx + semitones) % 12;
  if (newIdx < 0) newIdx += 12;

  const newRoot = scale[newIdx];
  return `${newRoot}${suffix}`;
};

// Transpose chord mentions inside tablature/chords text
export const transposeTabContent = (content, semitones) => {
  if (!content || semitones === 0) return content;

  // Replace chords in brackets, lines starting with chords, or standalone chords
  return content.replace(/\b([A-G][b#]?(?:m|maj|min|dim|aug|sus[24]?|add[29]?|[0-9]+)*(?:\/[A-G][b#]?)?)\b/g, (match) => {
    // Avoid transposing single letters in English words like "A", "I", "e" in tab lines
    if (match === 'e' || match === 'B' || match === 'G' || match === 'D' || match === 'A' || match === 'E') {
      return match;
    }
    return transposeChord(match, semitones);
  });
};

// ─── Guitar Chord Dictionary & Fret Fingerings ────────────────────────────────
// Strings order: [E2, A2, D3, G3, B3, E4]. -1 = Muted (X), 0 = Open (O), >0 = Fret number
const CHORD_LIBRARY = {
  'C':      { frets: [-1, 3, 2, 0, 1, 0], fingers: ['X', '3', '2', 'O', '1', 'O'], baseFret: 1 },
  'C#':     { frets: [-1, 4, 6, 6, 6, 4], fingers: ['X', '1', '3', '3', '3', '1'], baseFret: 4 },
  'Db':     { frets: [-1, 4, 6, 6, 6, 4], fingers: ['X', '1', '3', '3', '3', '1'], baseFret: 4 },
  'D':      { frets: [-1, -1, 0, 2, 3, 2], fingers: ['X', 'X', 'O', '1', '3', '2'], baseFret: 1 },
  'D#':     { frets: [-1, 6, 8, 8, 8, 6], fingers: ['X', '1', '3', '3', '3', '1'], baseFret: 6 },
  'Eb':     { frets: [-1, 6, 8, 8, 8, 6], fingers: ['X', '1', '3', '3', '3', '1'], baseFret: 6 },
  'E':      { frets: [0, 2, 2, 1, 0, 0], fingers: ['O', '2', '3', '1', 'O', 'O'], baseFret: 1 },
  'F':      { frets: [1, 3, 3, 2, 1, 1], fingers: ['1', '3', '4', '2', '1', '1'], baseFret: 1 },
  'F#':     { frets: [2, 4, 4, 3, 2, 2], fingers: ['1', '3', '4', '2', '1', '1'], baseFret: 2 },
  'G':      { frets: [3, 2, 0, 0, 0, 3], fingers: ['2', '1', 'O', 'O', 'O', '3'], baseFret: 1 },
  'G#':     { frets: [4, 6, 6, 5, 4, 4], fingers: ['1', '3', '4', '2', '1', '1'], baseFret: 4 },
  'Ab':     { frets: [4, 6, 6, 5, 4, 4], fingers: ['1', '3', '4', '2', '1', '1'], baseFret: 4 },
  'A':      { frets: [-1, 0, 2, 2, 2, 0], fingers: ['X', 'O', '1', '2', '3', 'O'], baseFret: 1 },
  'A#':     { frets: [-1, 1, 3, 3, 3, 1], fingers: ['X', '1', '2', '3', '4', '1'], baseFret: 1 },
  'Bb':     { frets: [-1, 1, 3, 3, 3, 1], fingers: ['X', '1', '2', '3', '4', '1'], baseFret: 1 },
  'B':      { frets: [-1, 2, 4, 4, 4, 2], fingers: ['X', '1', '2', '3', '4', '1'], baseFret: 2 },

  // Minors
  'Cm':     { frets: [-1, 3, 5, 5, 4, 3], fingers: ['X', '1', '3', '4', '2', '1'], baseFret: 3 },
  'C#m':    { frets: [-1, 4, 6, 6, 5, 4], fingers: ['X', '1', '3', '4', '2', '1'], baseFret: 4 },
  'Dm':     { frets: [-1, -1, 0, 2, 3, 1], fingers: ['X', 'X', 'O', '2', '3', '1'], baseFret: 1 },
  'D#m':    { frets: [-1, 6, 8, 8, 7, 6], fingers: ['X', '1', '3', '4', '2', '1'], baseFret: 6 },
  'Ebm':    { frets: [-1, 6, 8, 8, 7, 6], fingers: ['X', '1', '3', '4', '2', '1'], baseFret: 6 },
  'Em':     { frets: [0, 2, 2, 0, 0, 0], fingers: ['O', '2', '3', 'O', 'O', 'O'], baseFret: 1 },
  'Fm':     { frets: [1, 3, 3, 1, 1, 1], fingers: ['1', '3', '4', '1', '1', '1'], baseFret: 1 },
  'F#m':    { frets: [2, 4, 4, 2, 2, 2], fingers: ['1', '3', '4', '1', '1', '1'], baseFret: 2 },
  'Gm':     { frets: [3, 5, 5, 3, 3, 3], fingers: ['1', '3', '4', '1', '1', '1'], baseFret: 3 },
  'G#m':    { frets: [4, 6, 6, 4, 4, 4], fingers: ['1', '3', '4', '1', '1', '1'], baseFret: 4 },
  'Am':     { frets: [-1, 0, 2, 2, 1, 0], fingers: ['X', 'O', '2', '3', '1', 'O'], baseFret: 1 },
  'A#m':    { frets: [-1, 1, 3, 3, 2, 1], fingers: ['X', '1', '3', '4', '2', '1'], baseFret: 1 },
  'Bbm':    { frets: [-1, 1, 3, 3, 2, 1], fingers: ['X', '1', '3', '4', '2', '1'], baseFret: 1 },
  'Bm':     { frets: [-1, 2, 4, 4, 3, 2], fingers: ['X', '1', '3', '4', '2', '1'], baseFret: 2 },

  // 7ths & Extended
  'C7':     { frets: [-1, 3, 2, 3, 1, 0], fingers: ['X', '3', '2', '4', '1', 'O'], baseFret: 1 },
  'D7':     { frets: [-1, -1, 0, 2, 1, 2], fingers: ['X', 'X', 'O', '2', '1', '3'], baseFret: 1 },
  'E7':     { frets: [0, 2, 0, 1, 0, 0], fingers: ['O', '2', 'O', '1', 'O', 'O'], baseFret: 1 },
  'G7':     { frets: [3, 2, 0, 0, 0, 1], fingers: ['3', '2', 'O', 'O', 'O', '1'], baseFret: 1 },
  'A7':     { frets: [-1, 0, 2, 0, 2, 0], fingers: ['X', 'O', '2', 'O', '3', 'O'], baseFret: 1 },
  'B7':     { frets: [-1, 2, 1, 2, 0, 2], fingers: ['X', '2', '1', '3', 'O', '4'], baseFret: 1 },
  'Em7':    { frets: [0, 2, 0, 0, 0, 0], fingers: ['O', '2', 'O', 'O', 'O', 'O'], baseFret: 1 },
  'Am7':    { frets: [-1, 0, 2, 0, 1, 0], fingers: ['X', 'O', '2', 'O', '1', 'O'], baseFret: 1 },
  'Dm7':    { frets: [-1, -1, 0, 2, 1, 1], fingers: ['X', 'X', 'O', '2', '1', '1'], baseFret: 1 },
  'Fmaj7':  { frets: [-1, -1, 3, 2, 1, 0], fingers: ['X', 'X', '3', '2', '1', 'O'], baseFret: 1 },
  'Cmaj7':  { frets: [-1, 3, 2, 0, 0, 0], fingers: ['X', '3', '2', 'O', 'O', 'O'], baseFret: 1 },

  // Power Chords
  'D5':     { frets: [-1, -1, 0, 2, 3, -1], fingers: ['X', 'X', 'O', '1', '3', 'X'], baseFret: 1 },
  'E5':     { frets: [0, 2, 2, -1, -1, -1], fingers: ['O', '1', '2', 'X', 'X', 'X'], baseFret: 1 },
  'F5':     { frets: [1, 3, 3, -1, -1, -1], fingers: ['1', '3', '4', 'X', 'X', 'X'], baseFret: 1 },
  'G5':     { frets: [3, 5, 5, -1, -1, -1], fingers: ['1', '3', '4', 'X', 'X', 'X'], baseFret: 3 },
  'A5':     { frets: [-1, 0, 2, 2, -1, -1], fingers: ['X', 'O', '1', '2', 'X', 'X'], baseFret: 1 },
  'C5':     { frets: [-1, 3, 5, 5, -1, -1], fingers: ['X', '1', '3', '4', 'X', 'X'], baseFret: 3 },
  'Bb5':    { frets: [-1, 1, 3, 3, -1, -1], fingers: ['X', '1', '3', '4', 'X', 'X'], baseFret: 1 }
};

// Polyphonic Web Audio Guitar Chord Strummer
export const strumChordAudio = (chordName) => {
  try {
    const chord = CHORD_LIBRARY[chordName] || CHORD_LIBRARY['Em'];
    if (!chord) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const standardFreqs = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]; // E2, A2, D3, G3, B3, E4

    chord.frets.forEach((fret, strIdx) => {
      if (fret === -1) return; // Muted string

      const freq = standardFreqs[strIdx] * Math.pow(2, fret / 12);
      const strTime = audioCtx.currentTime + strIdx * 0.028; // 28ms pick arpeggiation delay

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Triangular waves with subtle harmonics mimic guitar acoustic string timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, strTime);

      gain.gain.setValueAtTime(0.001, strTime);
      gain.gain.exponentialRampToValueAtTime(0.28, strTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0005, strTime + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(strTime);
      osc.stop(strTime + 1.8);
    });
  } catch (e) {
    console.warn('WebAudio chord strummer error:', e);
  }
};

// Web Audio Metronome Tick Click
export const playMetronomeClick = (isFirstBeat) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFirstBeat ? 1200 : 800, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(isFirstBeat ? 0.35 : 0.18, audioCtx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    console.warn('Metronome audio error:', e);
  }
};

// Play reference tone using WebAudio Oscillator
const playReferenceTone = (freq) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.8);
  } catch (e) {
    console.warn('AudioContext error:', e);
  }
};

// Animated string visualizer
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

// Mini Fretboard Chord Box Component
const ChordBoxDiagram = ({ chordName, onStrum }) => {
  const data = CHORD_LIBRARY[chordName];
  const frets = data ? data.frets : [-1, 0, 2, 2, 1, 0];
  const fingers = data ? data.fingers : ['X', 'O', '2', '3', '1', 'O'];

  return (
    <div className="flex flex-col items-center p-3 rounded-2xl bg-[#14171f] border border-orange-500/30 shadow-2xl">
      <div className="flex items-center justify-between w-full px-1 mb-2">
        <span className="text-base font-black text-orange-400 font-mono">{chordName}</span>
        <button
          onClick={() => {
            strumChordAudio(chordName);
            onStrum?.();
          }}
          className="px-2 py-0.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[10px] font-bold flex items-center gap-1 transition"
          title="Strum this chord"
        >
          <Volume2 className="w-3 h-3" />
          <span>Strum</span>
        </button>
      </div>

      {/* 6-String Fret Grid SVG */}
      <svg width={100} height={110} className="select-none">
        {/* Nut (Top Fret bar) */}
        <line x1={15} y1={20} x2={85} y2={20} stroke="#f97316" strokeWidth={3.5} strokeLinecap="round" />

        {/* 4 Frets */}
        {[38, 56, 74, 92].map((y, i) => (
          <line key={i} x1={15} y1={y} x2={85} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        ))}

        {/* 6 Strings */}
        {[15, 29, 43, 57, 71, 85].map((x, strIdx) => {
          const fret = frets[strIdx];
          const isMuted = fret === -1;
          const isOpen  = fret === 0;
          return (
            <g key={strIdx}>
              {/* String line */}
              <line x1={x} y1={20} x2={x} y2={92} stroke="rgba(255,255,255,0.4)" strokeWidth={strIdx < 3 ? 1.5 : 1} />

              {/* Open / Muted Marker above nut */}
              {isMuted && (
                <text x={x} y={12} textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">✕</text>
              )}
              {isOpen && (
                <circle cx={x} cy={10} r={3} fill="none" stroke="#22c55e" strokeWidth={1.2} />
              )}

              {/* Finger Dot on Fret */}
              {fret > 0 && fret <= 4 && (
                <g>
                  <circle
                    cx={x}
                    cy={20 + fret * 18 - 9}
                    r={5}
                    fill="#fb923c"
                    style={{ filter: 'drop-shadow(0 0 4px #ea580c)' }}
                  />
                  <text
                    x={x}
                    y={20 + fret * 18 - 6}
                    textAnchor="middle"
                    fill="black"
                    fontSize="7"
                    fontWeight="black"
                  >
                    {fingers[strIdx] || ''}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
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
      className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 border border-orange-500/30 hover:border-orange-500 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 cursor-pointer"
    >
      <FileText style={{ width: 11, height: 11 }} />
      <span>Chords & Tab</span>
    </button>

    {/* Tuning badge */}
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
        className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white cursor-pointer"
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
        className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white cursor-pointer"
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
        className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white cursor-pointer"
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

  // ── Guitar Tab & Chords Inspector Modal State ──
  const [selectedTabTrack, setSelectedTabTrack]   = useState(null);
  const [currentTabDetails, setCurrentTabDetails] = useState(null);
  const [isTabModalOpen, setIsTabModalOpen]       = useState(false);
  const [copiedTab, setCopiedTab]                 = useState(false);
  const [tabZoomLevel, setTabZoomLevel]           = useState(1.0);
  const [isFullScreenTab, setIsFullScreenTab]     = useState(false);

  // ── Advanced Music Theory & Live Practice State ──
  const [transposeOffset, setTransposeOffset]     = useState(0); // Semitones: -6 to +6
  const [capoFret, setCapoFret]                   = useState(0); // Capo: 0 to 7
  const [selectedChordDiagram, setSelectedChordDiagram] = useState(null); // Active inspecting chord

  // Auto-scroll practice engine
  const [isAutoScrolling, setIsAutoScrolling]     = useState(false);
  const [scrollSpeed, setScrollSpeed]             = useState(1.0); // 0.5x, 1.0x, 1.5x, 2.0x
  const tabContentRef = useRef(null);
  const autoScrollRafRef = useRef(null);

  // Live Metronome Engine
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeBpm, setMetronomeBpm]           = useState(96);
  const [metronomeBeat, setMetronomeBeat]         = useState(0);
  const metronomeIntervalRef                      = useRef(null);

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
    setTransposeOffset(0);
    setSelectedChordDiagram(null);
    setIsAutoScrolling(false);
    setIsMetronomeActive(false);
    setMetronomeBpm(track.bpm || 96);
    setIsTabModalOpen(true);

    try {
      const tab = await api.getGuitarTabs(track.id);
      if (tab) {
        setCurrentTabDetails(tab);
        setCapoFret(tab.capo || 0);
        if (tab.chords && tab.chords.length > 0) {
          setSelectedChordDiagram(tab.chords[0]);
        }
      } else {
        // Fallback default tab representation
        const fallback = {
          title: `${track.title} Chords & Tab`,
          artist: track.artist_name || track.artist,
          tuning: track.tuning || 'Standard E',
          capo: 0,
          difficulty: track.difficulty || 'Intermediate',
          chords: ['Em', 'C', 'D', 'G'],
          tab_content: `Key: ${track.key_signature || 'Em'}\nTuning: ${track.tuning || 'Standard E'}\n\n[Intro Riff]\ne|---0-2-3--2-0-----|\nB|---------------3--|\n\nChords: Em - C - D - G`
        };
        setCurrentTabDetails(fallback);
        setSelectedChordDiagram('Em');
      }
    } catch (e) {
      console.warn('Failed to load tab:', e);
    }
  };

  // Auto-scroll loop
  useEffect(() => {
    if (!isAutoScrolling) {
      cancelAnimationFrame(autoScrollRafRef.current);
      return;
    }

    const scrollStep = () => {
      if (tabContentRef.current) {
        tabContentRef.current.scrollTop += scrollSpeed * 0.75;
      }
      autoScrollRafRef.current = requestAnimationFrame(scrollStep);
    };

    autoScrollRafRef.current = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(autoScrollRafRef.current);
  }, [isAutoScrolling, scrollSpeed]);

  // Metronome Timer loop
  useEffect(() => {
    if (!isMetronomeActive) {
      clearInterval(metronomeIntervalRef.current);
      setMetronomeBeat(0);
      return;
    }

    const intervalMs = (60 / metronomeBpm) * 1000;
    metronomeIntervalRef.current = setInterval(() => {
      setMetronomeBeat(prev => {
        const next = (prev + 1) % 4;
        playMetronomeClick(next === 0);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(metronomeIntervalRef.current);
  }, [isMetronomeActive, metronomeBpm]);

  // Dynamically Transposed Chords List
  const transposedChords = useMemo(() => {
    if (!currentTabDetails?.chords) return [];
    return currentTabDetails.chords.map(c => transposeChord(c, transposeOffset));
  }, [currentTabDetails, transposeOffset]);

  // Dynamically Transposed Tablature Text
  const transposedContent = useMemo(() => {
    const raw = currentTabDetails?.tab_content || currentTabDetails?.tabContent || '';
    return transposeTabContent(raw, transposeOffset);
  }, [currentTabDetails, transposeOffset]);

  const handleCopyTab = () => {
    if (!currentTabDetails) return;
    const textToCopy = `${currentTabDetails.title} by ${currentTabDetails.artist}\nKey: Transposed (${transposeOffset >= 0 ? '+' : ''}${transposeOffset})\n\n${transposedContent}`;
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
        {/* Layered gradients */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(6,4,2,0.97) 0%, rgba(6,4,2,0.80) 45%, rgba(6,4,2,0.2) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #090A0C 0%, transparent 50%)'
        }} />

        {/* Decorative fret rings */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-6 opacity-60 pointer-events-none">
          <FretRing size={90}  label="E" color="#f97316" />
          <FretRing size={120} label="Am" color="#fb923c" />
          <FretRing size={80}  label="G" color="#fdba74" />
        </div>

        {/* Hero content */}
        <div className="relative h-full flex flex-col justify-end px-8 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
                 style={{ background: 'rgba(251,146,60,0.2)', border: '1px solid rgba(251,146,60,0.5)' }}>
              <Guitar style={{ width: 14, height: 14, color: '#fb923c' }} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: '#fb923c' }}>
              Guitar Studio 2.0 & Transposition Hub
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
            GUITAR STUDIO
          </h1>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            Real-time chord transposition, hands-free auto-scroll, WebAudio chord strummer, capo calculator & stage tabs.
          </p>

          {/* Play featured */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => onPlayTrack(featured)}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-full font-extrabold text-sm transition-all hover:scale-105 cursor-pointer"
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

        {/* ── Featured Song Tabs Cards ── */}
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
                      className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 text-black flex items-center justify-center transition-all shadow-md group-hover:scale-110 cursor-pointer"
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

        {/* ── Category Selector ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-white"
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18 }}>
              Browse by Style
            </h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)}
                      className="text-xs font-bold transition hover:text-white cursor-pointer"
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

        {/* ── Tuner Reference ── */}
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
                    className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
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
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-orange-500/20 border border-white/5 hover:border-orange-500/40 transition-all group active:scale-95 cursor-pointer"
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
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

          {/* Table header */}
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

      {/* ── ADVANCED INTERACTIVE GUITAR TAB & CHORDS SHEET MODAL ── */}
      {isTabModalOpen && selectedTabTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className={`relative w-full ${isFullScreenTab ? 'max-w-6xl h-[94vh]' : 'max-w-3xl max-h-[88vh]'} rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl transition-all duration-300`}
            style={{ background: '#0e1014' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-orange-950/40 via-[#16120e] to-black">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/20">
                  <Guitar style={{ width: 22, height: 22 }} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight flex items-center gap-2">
                    <span>{selectedTabTrack.title}</span>
                    {transposeOffset !== 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {transposeOffset > 0 ? `+${transposeOffset}` : transposeOffset} ST
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedTabTrack.artist_name || selectedTabTrack.artist} · {selectedTabTrack.album || 'Studio Session'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Tab Zoom Stepper */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setTabZoomLevel(z => Math.max(0.85, Math.round((z - 0.15) * 100) / 100))}
                    disabled={tabZoomLevel <= 0.85}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    title="Zoom Out Tab (-)"
                  >
                    <ZoomOut style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    onClick={toggleTabZoom}
                    className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold text-orange-400 hover:bg-orange-500/10 transition cursor-pointer"
                    title="Toggle Zoom: 100% → 125% → 150% → 180%"
                  >
                    {Math.round(tabZoomLevel * 100)}%
                  </button>
                  <button
                    onClick={() => setTabZoomLevel(z => Math.min(2.0, Math.round((z + 0.15) * 100) / 100))}
                    disabled={tabZoomLevel >= 2.0}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                    title="Zoom In Tab (+)"
                  >
                    <ZoomIn style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                {/* Stage Mode Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullScreenTab(!isFullScreenTab)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                  title={isFullScreenTab ? "Exit Stage View" : "Stage Mode (Large View)"}
                >
                  {isFullScreenTab ? (
                    <Minimize2 style={{ width: 14, height: 14 }} />
                  ) : (
                    <Maximize2 style={{ width: 14, height: 14 }} />
                  )}
                </button>

                {/* Copy Tab text */}
                <button
                  onClick={handleCopyTab}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                  title="Copy formatted tablature with transposed chords"
                >
                  {copiedTab ? (
                    <><Check style={{ width: 14, height: 14, color: '#22c55e' }} /> Copied</>
                  ) : (
                    <><Copy style={{ width: 14, height: 14 }} /> Copy</>
                  )}
                </button>

                {/* Close modal */}
                <button
                  onClick={() => setIsTabModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </div>

            {/* ── ADVANCED TOOLBAR: TRANSPOSITION, CAPO, AUTO-SCROLL, METRONOME ── */}
            <div className="px-6 py-2.5 bg-[#12141a] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">

              {/* 1. Transpose Hub */}
              <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold text-gray-400 px-1">Transpose:</span>
                <button
                  onClick={() => setTransposeOffset(prev => Math.max(-6, prev - 1))}
                  className="w-6 h-6 rounded-lg bg-white/5 hover:bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold transition cursor-pointer"
                  title="Transpose Down 1 Semitone (-)"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-white text-xs">
                  {transposeOffset > 0 ? `+${transposeOffset}` : transposeOffset}
                </span>
                <button
                  onClick={() => setTransposeOffset(prev => Math.min(6, prev + 1))}
                  className="w-6 h-6 rounded-lg bg-white/5 hover:bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold transition cursor-pointer"
                  title="Transpose Up 1 Semitone (+)"
                >
                  +
                </button>
                {transposeOffset !== 0 && (
                  <button
                    onClick={() => setTransposeOffset(0)}
                    className="p-1 text-gray-400 hover:text-orange-400 transition ml-1 cursor-pointer"
                    title="Reset to Original Key"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 2. Capo Selector */}
              <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold text-gray-400 px-1">Capo:</span>
                <select
                  value={capoFret}
                  onChange={e => setCapoFret(Number(e.target.value))}
                  className="bg-transparent text-amber-300 font-bold outline-none cursor-pointer text-xs"
                >
                  <option value={0} className="bg-[#14171f] text-white">No Capo</option>
                  {[1, 2, 3, 4, 5, 6, 7].map(f => (
                    <option key={f} value={f} className="bg-[#14171f] text-white">Fret {f}</option>
                  ))}
                </select>
              </div>

              {/* 3. Hands-Free Auto-Scroll Practice Engine */}
              <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    isAutoScrolling
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                  title={isAutoScrolling ? "Pause Auto-Scroll" : "Start Auto-Scroll"}
                >
                  {isAutoScrolling ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isAutoScrolling ? 'Scrolling' : 'Auto-Scroll'}</span>
                </button>
                <div className="flex items-center gap-0.5 px-1">
                  {[0.5, 1.0, 1.5, 2.0].map(s => (
                    <button
                      key={s}
                      onClick={() => setScrollSpeed(s)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                        scrollSpeed === s ? 'bg-orange-500/20 text-orange-400 font-bold' : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Integrated Metronome */}
              <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    isMetronomeActive
                      ? 'bg-orange-500 text-black shadow-md shadow-orange-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                  title={isMetronomeActive ? "Stop Metronome" : "Start Metronome"}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isMetronomeActive ? `${metronomeBpm} BPM` : 'Metronome'}</span>
                </button>
                {isMetronomeActive && (
                  <div className="flex items-center gap-1 px-1">
                    {[0, 1, 2, 3].map(b => (
                      <span
                        key={b}
                        className={`w-2 h-2 rounded-full transition-all duration-100 ${
                          metronomeBeat === b
                            ? b === 0 ? 'bg-amber-300 scale-125 shadow-lg' : 'bg-orange-400 scale-110'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Play Audio Track */}
              <button
                onClick={() => onPlayTrack(selectedTabTrack)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-orange-500 text-black hover:bg-orange-400 transition cursor-pointer shadow-md shadow-orange-500/25"
              >
                {currentTrack?.id === selectedTabTrack.id && isPlaying ? (
                  <><Pause style={{ width: 13, height: 13, fill: 'black' }} /> Playing</>
                ) : (
                  <><Play style={{ width: 13, height: 13, fill: 'black', marginLeft: 1 }} /> Play Track</>
                )}
              </button>
            </div>

            {/* ── INTERACTIVE CHORDS BAR & REAL-TIME STRUMMER ── */}
            {transposedChords.length > 0 && (
              <div className="px-6 py-3 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1 flex-shrink-0">
                    <Music style={{ width: 13, height: 13 }} /> Click to Strum / Inspect:
                  </span>
                  {transposedChords.map((chord) => {
                    const isInspecting = selectedChordDiagram === chord;
                    return (
                      <button
                        key={chord}
                        onClick={() => {
                          setSelectedChordDiagram(chord);
                          strumChordAudio(chord);
                        }}
                        className={`font-extrabold tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                          isInspecting
                            ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/40 scale-105'
                            : 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30'
                        }`}
                        style={{
                          padding: `${5 * tabZoomLevel}px ${11 * tabZoomLevel}px`,
                          fontSize: `${12 * tabZoomLevel}px`,
                        }}
                        title={`Click to strum and inspect ${chord}`}
                      >
                        <span>{chord}</span>
                        <Volume2 className="w-3 h-3 opacity-60" />
                      </button>
                    );
                  })}
                </div>

                {/* Strumming Pattern Indicator */}
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold text-gray-400">Strumming:</span>
                  <span className="font-mono text-xs font-bold text-orange-400 tracking-widest">
                    D - D - U - U - D - U
                  </span>
                </div>
              </div>
            )}

            {/* ── MODAL BODY: SPLIT VIEW (FRETBOARD DIAGRAM + MONOSPACE TAB SHEET) ── */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">

              {/* Left Column: Interactive Chord Fretboard Box Inspector */}
              {selectedChordDiagram && (
                <div className="w-full md:w-56 p-5 flex flex-col items-center justify-center bg-black/40 flex-shrink-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>Chord Diagram</span>
                  </p>
                  <ChordBoxDiagram
                    chordName={selectedChordDiagram}
                    onStrum={() => strumChordAudio(selectedChordDiagram)}
                  />
                  <p className="text-[10px] text-gray-500 text-center mt-3 max-w-[150px]">
                    Numbers indicate finger fretting. Dots mark sounding frets.
                  </p>
                </div>
              )}

              {/* Right Column: Tablature Sheet with Smooth Auto-Scroll */}
              <div
                ref={tabContentRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
              >
                <pre
                  className="font-mono leading-relaxed text-gray-200 bg-black/60 p-6 rounded-2xl border border-white/5 overflow-x-auto select-text whitespace-pre transition-all duration-200"
                  style={{
                    fontSize: `${13 * tabZoomLevel}px`,
                    lineHeight: tabZoomLevel > 1.3 ? 1.8 : 1.65,
                  }}
                >
                  {transposedContent || 'Loading tablature...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
