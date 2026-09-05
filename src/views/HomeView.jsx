import React from 'react';
import { Play, Pause, Download, CheckCircle, Heart, Plus, Sparkles, Disc, Flame, Bell, Settings, Headphones } from 'lucide-react';
import { MOCK_TRACKS, MOCK_ALBUMS } from '../data/mockTracks';

export const HomeView = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  downloadedTrackIds,
  onDownloadTrack,
  likedTrackIds,
  onToggleLikeTrack,
  onAddToQueue,
  onSelectAlbum,
  onSelectPlaylist
}) => {
  const heroTrack = MOCK_TRACKS[0]; // Metavoid Symphony (XOR Collective)
  const isHeroPlaying = currentTrack?.id === heroTrack.id && isPlaying;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto pb-28 select-none">
      {/* 1. FIGMA HEADER WITH BELL & SETTINGS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight flex items-center gap-3">
            <span>{getGreeting()}</span>
          </h2>
          <p className="text-xs text-[#8E929B] mt-0.5">Welcome back to your Obsidian Studio session.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl bg-[#14161A] hover:bg-[#1E2027] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition">
            <Bell className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#14161A] hover:bg-[#1E2027] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. FIGMA HERO BANNER: OBSIDIAN ESSENTIALS 2026 */}
      <div className="relative rounded-3xl overflow-hidden border border-[#00E676]/30 shadow-2xl bg-gradient-to-r from-[#14161A] via-[#101216] to-[#090A0C]">
        {/* Dynamic Image & Vector Wave Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay blur-sm scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${heroTrack.coverUrl})` }}
        />

        <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Hero Meta Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676] text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-[#00E676]" />
              <span>FEATURED PLAYLIST</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-['Outfit'] leading-none">
              OBSIDIAN ESSENTIALS 2026
            </h1>

            <p className="text-xs sm:text-sm text-[#8E929B] font-medium max-w-xl leading-relaxed">
              The dark wave benchmark. Curated heavy industrial techno, cyber-synth soundtracks, and premium offline listening favorites.
            </p>

            {/* Action Buttons: Listen Now & Save */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => currentTrack?.id === heroTrack.id ? onTogglePlay() : onPlayTrack(heroTrack)}
                className="btn-neon-crimson px-8 py-3.5 flex items-center gap-3 text-xs font-black tracking-wider uppercase text-black"
              >
                {isHeroPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-black" />
                    <span>PAUSE PLAYBACK</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                    <span>LISTEN NOW</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleLikeTrack(heroTrack.id)}
                className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-extrabold flex items-center gap-2 transition"
              >
                <Heart className={`w-4 h-4 ${likedTrackIds.includes(heroTrack.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>SAVE TO LIBRARY</span>
              </button>
            </div>
          </div>

          {/* Hero Thumbnail */}
          <div className="relative group flex-shrink-0">
            <img 
              src={heroTrack.coverUrl} 
              alt={heroTrack.title} 
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-2xl border-2 border-white/10 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* 3. FIGMA RECENTLY PLAYED GRID (6 CARDS) */}
      <div>
        <h3 className="text-xl font-bold text-white mb-5 font-['Outfit']">Recently Played</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TRACKS.slice(0, 6).map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isPlayingThis = isCurrent && isPlaying;

            return (
              <div 
                key={track.id}
                onClick={() => isCurrent ? onTogglePlay() : onPlayTrack(track)}
                className={`group relative flex items-center gap-4 bg-[#14161A] hover:bg-[#1E2027] p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isCurrent ? 'border-[#00E676] shadow-lg shadow-[#00E676]/15' : 'border-white/5'
                }`}
              >
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className={`text-xs font-extrabold truncate ${isCurrent ? 'text-[#00E676]' : 'text-white'}`}>
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-[#8E929B] truncate mt-0.5">{track.artist}</p>
                </div>
                
                {/* Play Button */}
                <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-9 h-9 rounded-full bg-[#00E676] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FIGMA TRENDING NOW GRID (6 CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-white font-['Outfit']">Trending Now</h3>
          <span className="text-xs font-bold text-[#00E676] hover:underline cursor-pointer">Show All</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {MOCK_TRACKS.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isPlayingThis = isCurrent && isPlaying;
            const isDownloaded = downloadedTrackIds.includes(track.id);
            const isLiked = likedTrackIds.includes(track.id);

            return (
              <div 
                key={track.id}
                className="group p-3.5 rounded-2xl bg-[#14161A] hover:bg-[#1E2027] border border-white/5 card-hover-lift cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-3 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => isCurrent ? onTogglePlay() : onPlayTrack(track)}
                        className="w-10 h-10 rounded-full bg-[#00E676] text-black flex items-center justify-center shadow-xl hover:scale-110 transition"
                      >
                        {isPlayingThis ? (
                          <Pause className="w-5 h-5 fill-black" />
                        ) : (
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        )}
                      </button>
                    </div>

                    {isDownloaded && (
                      <div className="absolute top-2 right-2 p-1 bg-black/70 backdrop-blur rounded-full border border-[#00E676]/40">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00E676]" />
                      </div>
                    )}
                  </div>

                  <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-[#00E676]' : 'text-white'}`}>
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-[#8E929B] truncate mt-0.5">{track.artist}</p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-gray-400">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#00E676]">{track.genre}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onToggleLikeTrack(track.id)}
                      className={`hover:scale-110 transition ${isLiked ? 'text-rose-500 fill-rose-500' : 'hover:text-white'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button 
                      onClick={() => onAddToQueue(track)}
                      className="hover:text-white transition"
                      title="Add to Queue"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
