import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Download, 
  Plus, 
  Heart, 
  Wifi, 
  WifiOff, 
  HardDrive, 
  Music2, 
  Radio, 
  Smartphone,
  ShieldCheck,
  User
} from 'lucide-react';
import { getStorageUsageInfo } from '../services/db';

export const Sidebar = ({ 
  currentView, 
  setCurrentView, 
  isOfflineMode, 
  setIsOfflineMode, 
  userPlaylists, 
  onCreatePlaylistClick,
  onPlaylistClick,
  likedTrackCount,
  downloadCount,
  user
}) => {
  const [storageInfo, setStorageInfo] = useState({ totalMB: '0.00', count: 0 });

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const info = await getStorageUsageInfo();
        setStorageInfo(info);
      } catch (e) {
        console.error('Storage check err:', e);
      }
    };
    fetchStorage();
    const interval = setInterval(fetchStorage, 4000);
    return () => clearInterval(interval);
  }, [downloadCount]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'downloaded', label: 'Offline Mode', icon: Download, badge: downloadCount },
    { id: 'preview', label: 'Device Preview', icon: Smartphone, highlight: true }
  ];

  return (
    <aside className="w-64 bg-[#090A0C] border-r border-white/5 flex flex-col h-full select-none z-20 flex-shrink-0">
      {/* Brand Logo - Exact Figma Prototype 'OBSIDIAN' */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-9 h-9 rounded-xl bg-[#00E676] flex items-center justify-center shadow-lg shadow-[#00E676]/25">
            {/* Geometric Diamond Cyber Icon */}
            <div className="w-4 h-4 bg-black rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#00E676] rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-widest text-white font-['Outfit']">
              OBSIDIAN
            </h1>
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#00E676] block -mt-1">
              STUDIO & OFFLINE
            </span>
          </div>
        </div>
      </div>

      {/* Primary Nav Menu */}
      <div className="px-3 py-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                isActive 
                  ? 'bg-[#1E2026] text-white font-extrabold shadow-sm border-l-4 border-[#00E676]' 
                  : item.highlight 
                    ? 'text-[#00E676] hover:bg-white/5 font-bold border border-[#00E676]/30 my-1' 
                    : 'text-[#8E929B] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00E676]' : item.highlight ? 'text-[#00E676]' : 'text-[#8E929B]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <hr className="my-3 mx-4 border-white/5" />

      {/* Library Quick Access */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#5C6069]">
          PLAYLISTS
        </span>
        <button 
          onClick={onCreatePlaylistClick}
          className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
          title="Create Playlist"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Playlists List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-1">
        {/* Liked Songs Tile */}
        <button
          onClick={() => setCurrentView('liked')}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs transition ${
            currentView === 'liked' ? 'bg-[#1E2026] text-white' : 'text-[#8E929B] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-black flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <div className="text-left flex-1 truncate">
            <p className="font-bold text-white truncate text-xs">Liked Songs</p>
            <p className="text-[10px] text-gray-500 truncate">{likedTrackCount} tracks</p>
          </div>
        </button>

        {userPlaylists.map((pl) => (
          <button
            key={pl.id}
            onClick={() => onPlaylistClick(pl.id)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs transition ${
              currentView === `playlist-${pl.id}` ? 'bg-[#1E2026] text-white' : 'text-[#8E929B] hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-[#14161A] border border-white/10 flex items-center justify-center">
              <Music2 className="w-3.5 h-3.5 text-[#00E676]" />
            </div>
            <div className="text-left flex-1 truncate">
              <p className="font-bold text-white truncate text-xs">{pl.title}</p>
              <p className="text-[10px] text-gray-500 truncate">{pl.tracks ? pl.tracks.length : 0} tracks</p>
            </div>
          </button>
        ))}
      </div>

      {/* Figma Profile Footer: Kaelen Vance */}
      <div className="p-4 border-t border-white/5 bg-[#101216] space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#14161A] border border-white/5">
          <div className="relative">
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover border border-[#00E676]"
            />
            <div className="w-2.5 h-2.5 rounded-full bg-[#00E676] absolute -bottom-0.5 -right-0.5 border-2 border-[#14161A]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Kaelen Vance'}</p>
            <p className="text-[9px] font-extrabold text-[#00E676] uppercase tracking-wider truncate">
              {isOfflineMode ? 'OFFLINE CACHED' : 'PRO / ONLINE'}
            </p>
          </div>
        </div>

        {/* Network Mode Switch */}
        <div className="flex items-center justify-between bg-[#090A0C] p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            {isOfflineMode ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-[#00E676]" />
            )}
            <span className="text-[11px] font-bold text-gray-300">
              {isOfflineMode ? 'Offline Mode' : 'Online Stream'}
            </span>
          </div>
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`w-9 h-4.5 rounded-full p-0.5 transition-colors duration-200 ${
              isOfflineMode ? 'bg-amber-500' : 'bg-[#00E676]'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-black transition-transform duration-200 transform ${
                isOfflineMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
};
