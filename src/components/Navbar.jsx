import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, User, ShieldCheck, WifiOff, LogOut, CheckCircle, Settings, HardDrive } from 'lucide-react';

export const Navbar = ({ 
  currentView, 
  searchQuery, 
  setSearchQuery, 
  isOfflineMode, 
  onBack, 
  onForward,
  user,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-16 px-8 flex items-center justify-between glass-header sticky top-0 z-20 select-none">
      {/* Navigation & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-gray-300 hover:text-white transition"
            title="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={onForward}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-gray-300 hover:text-white transition"
            title="Go Forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Search Bar */}
        {currentView === 'search' && (
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks, artists, albums, or genres (e.g. Lofi)..."
              className="w-full bg-[#1A1A22] border border-white/10 text-white placeholder-gray-400 text-xs rounded-full pl-10 pr-4 py-2.5 outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-3 relative">
        {isOfflineMode ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OFFLINE SIMULATOR</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">STREAMING ONLINE</span>
          </div>
        )}

        {/* Profile Pill & Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 bg-[#1A1A22] hover:bg-[#24242F] p-1.5 pr-3 rounded-full border border-white/10 cursor-pointer transition"
          >
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"} 
              alt={user?.name || "User"}
              className="w-7 h-7 rounded-full object-cover border border-[#1DB954]"
            />
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">
                {user?.name || 'Audiophile User'}
              </span>
              <span className="text-[9px] text-[#1DB954] font-semibold block leading-none">
                {user?.provider || 'Verified'}
              </span>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#161622] border border-white/10 rounded-2xl shadow-2xl p-2 z-30 space-y-1 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email || user?.phone || 'Premium Plan'}</p>
              </div>

              <div className="px-3 py-1.5 text-[11px] text-gray-400 flex items-center justify-between">
                <span>Auth Provider</span>
                <span className="font-bold text-[#1DB954]">{user?.provider}</span>
              </div>

              <button
                onClick={() => { setShowProfileMenu(false); onLogout(); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
