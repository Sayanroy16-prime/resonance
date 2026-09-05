import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Maximize2, 
  RotateCw, 
  Eye, 
  CheckCircle, 
  Sparkles, 
  Radio, 
  Wifi, 
  WifiOff, 
  Heart, 
  Play, 
  Pause, 
  Download,
  ShieldCheck
} from 'lucide-react';
import { MOCK_TRACKS } from '../data/mockTracks';

export const PreviewView = ({ 
  currentTrack, 
  isPlaying, 
  onTogglePlay, 
  isOfflineMode, 
  user 
}) => {
  const [deviceFrame, setDeviceFrame] = useState('iphone'); // 'iphone' | 'pixel' | 'ipad' | 'desktop'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape'
  const [simulatedScreen, setSimulatedScreen] = useState('home'); // 'home' | 'player' | 'offline' | 'auth'

  const deviceDimensions = {
    iphone: orientation === 'portrait' ? { width: 375, height: 780 } : { width: 780, height: 375 },
    pixel: orientation === 'portrait' ? { width: 412, height: 820 } : { width: 820, height: 412 },
    ipad: orientation === 'portrait' ? { width: 768, height: 960 } : { width: 960, height: 768 },
    desktop: { width: 1024, height: 640 }
  };

  const currentDim = deviceDimensions[deviceFrame];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-extrabold text-white font-['Outfit']">Interactive App Device Preview</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E63946]/20 text-[#E63946] text-xs font-bold border border-[#E63946]/30">
              Responsive Sandbox
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Check how Resonance looks and behaves across iOS, Android, Tablet, and Desktop screen sizes in real time.
          </p>
        </div>

        {/* Orientation Toggle */}
        <button
          onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
          className="px-4 py-2 rounded-xl bg-[#2B080C] hover:bg-[#3D0D13] border border-white/10 text-white text-xs font-bold flex items-center gap-2 transition"
        >
          <RotateCw className="w-4 h-4 text-[#D4AF37]" />
          <span>Rotate ({orientation === 'portrait' ? 'Portrait ↕' : 'Landscape ↔'})</span>
        </button>
      </div>

      {/* Device Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#2B080C] p-2 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrame('iphone')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              deviceFrame === 'iphone' ? 'bg-[#E63946] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iPhone 15 Pro</span>
          </button>

          <button
            onClick={() => setDeviceFrame('pixel')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              deviceFrame === 'pixel' ? 'bg-[#E63946] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Google Pixel 8</span>
          </button>

          <button
            onClick={() => setDeviceFrame('ipad')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              deviceFrame === 'ipad' ? 'bg-[#E63946] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>iPad Pro / Tablet</span>
          </button>

          <button
            onClick={() => setDeviceFrame('desktop')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              deviceFrame === 'desktop' ? 'bg-[#E63946] text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop Studio</span>
          </button>
        </div>

        {/* Screen View Preset Pills */}
        <div className="flex items-center gap-1.5 bg-[#1A0507] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setSimulatedScreen('home')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
              simulatedScreen === 'home' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Home View
          </button>
          <button
            onClick={() => setSimulatedScreen('player')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
              simulatedScreen === 'player' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Expanded Player
          </button>
          <button
            onClick={() => setSimulatedScreen('offline')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
              simulatedScreen === 'offline' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Offline Mode
          </button>
        </div>
      </div>

      {/* Device Frame Sandbox Container */}
      <div className="flex justify-center items-center py-8 bg-[#140305] rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden min-h-[600px]">
        {/* Background Ambient Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#E63946]/5 blur-3xl pointer-events-none" />

        {/* Outer Device Chassis Bezel */}
        <div 
          className="relative transition-all duration-300 shadow-2xl bg-[#0F0F14] border-[12px] border-[#2A2A38] rounded-[48px] overflow-hidden flex flex-col"
          style={{ 
            width: `${currentDim.width}px`, 
            height: `${currentDim.height}px`,
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(230, 57, 70, 0.15)'
          }}
        >
          {/* Dynamic Island / Notch Bezel (for mobile frames) */}
          {(deviceFrame === 'iphone' || deviceFrame === 'pixel') && orientation === 'portrait' && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-900/60 border border-blue-500/40" />
              <div className="w-3 h-3 rounded-full bg-black border border-white/20" />
            </div>
          )}

          {/* Device Screen Inner Canvas */}
          <div className="flex-1 bg-[#1A0507] text-white overflow-y-auto flex flex-col relative font-sans">
            
            {/* Status Bar */}
            <div className="h-10 px-5 pt-2 flex items-center justify-between text-[11px] font-bold text-gray-400 select-none border-b border-white/5">
              <span>9:41</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-[#E63946]" />
                <span>5G</span>
                <div className="w-5 h-2.5 rounded-sm border border-gray-400 p-0.5 flex items-center">
                  <div className="w-full h-full bg-white rounded-xs" />
                </div>
              </div>
            </div>

            {/* Simulated App Header */}
            <div className="p-4 flex items-center justify-between bg-[#2B080C] border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E63946] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-xs tracking-tight text-white font-['Outfit']">
                  RESONANCE
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isOfflineMode ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold border border-amber-500/40">
                    OFFLINE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#E63946]/20 text-[#E63946] text-[9px] font-bold border border-[#E63946]/40">
                    STREAMING
                  </span>
                )}
                <img 
                  src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                  alt="User"
                  className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Dynamic Screen Content inside Device */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {simulatedScreen === 'home' && (
                <>
                  <div>
                    <h4 className="text-base font-extrabold text-white font-['Outfit']">Good Evening</h4>
                    <p className="text-[10px] text-gray-400">Resonance Studio Maroon Preview</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {MOCK_TRACKS.slice(0, 4).map((t) => (
                      <div 
                        key={t.id}
                        onClick={onTogglePlay}
                        className="bg-[#2B080C] p-2 rounded-xl flex items-center gap-2 border border-white/5 cursor-pointer"
                      >
                        <img src={t.coverUrl} alt={t.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-white truncate">{t.title}</p>
                          <p className="text-[9px] text-gray-400 truncate">{t.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white mb-2">Featured Albums</h5>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {MOCK_TRACKS.map((t) => (
                        <div key={t.id} className="w-24 bg-[#2B080C] p-2 rounded-xl border border-white/5 flex-shrink-0">
                          <img src={t.coverUrl} alt={t.title} className="w-20 h-20 rounded-lg object-cover mb-1" />
                          <p className="text-[10px] font-bold text-white truncate">{t.title}</p>
                          <p className="text-[9px] text-gray-400 truncate">{t.genre}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {simulatedScreen === 'player' && (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                  <img 
                    src={currentTrack.coverUrl} 
                    alt={currentTrack.title} 
                    className="w-48 h-48 rounded-2xl object-cover shadow-2xl border border-white/10"
                  />
                  <div>
                    <h4 className="text-lg font-extrabold text-white">{currentTrack.title}</h4>
                    <p className="text-xs text-gray-300 font-semibold">{currentTrack.artist}</p>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block mt-1">
                      {currentTrack.genre} • MAROON SOUND
                    </span>
                  </div>

                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#E63946] h-full w-2/3 rounded-full" />
                  </div>

                  <div className="flex items-center gap-6">
                    <button onClick={onTogglePlay} className="w-12 h-12 rounded-full bg-[#E63946] text-white flex items-center justify-center shadow-lg">
                      {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                    </button>
                  </div>
                </div>
              )}

              {simulatedScreen === 'offline' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#2B080C] border border-[#E63946]/30 flex items-center gap-3">
                    <Download className="w-6 h-6 text-[#E63946]" />
                    <div>
                      <h5 className="text-xs font-bold text-white">IndexedDB Cached Audio</h5>
                      <p className="text-[10px] text-gray-400">1.68 MB stored for offline playback</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {MOCK_TRACKS.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-2 bg-[#2B080C] rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={t.coverUrl} alt={t.title} className="w-8 h-8 rounded object-cover" />
                          <div>
                            <p className="text-[11px] font-bold text-white">{t.title}</p>
                            <p className="text-[9px] text-gray-400">{t.artist}</p>
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-[#E63946]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persistent Mini Player inside Device Frame */}
            <div className="p-3 bg-[#2B080C] border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-9 h-9 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">{currentTrack.title}</p>
                  <p className="text-[9px] text-gray-400 truncate">{currentTrack.artist}</p>
                </div>
              </div>
              <button 
                onClick={onTogglePlay}
                className="w-8 h-8 rounded-full bg-[#E63946] text-white flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
