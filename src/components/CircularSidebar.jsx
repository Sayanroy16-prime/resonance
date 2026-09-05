import React, { useState } from 'react';
import {
  Home, Search, Library, Download, Smartphone,
  Heart, Music2, Wifi, WifiOff, Plus, Guitar
} from 'lucide-react';

const NAV = [
  { id: 'home',       icon: Home,       label: 'Home' },
  { id: 'search',     icon: Search,     label: 'Search' },
  { id: 'library',    icon: Library,    label: 'Library' },
  { id: 'guitar',     icon: Guitar,     label: 'Guitar',   accent: true },
  { id: 'downloaded', icon: Download,   label: 'Offline' },
  { id: 'preview',    icon: Smartphone, label: 'Preview',  highlight: true },
];

// Circular icon button
const NavBtn = ({ item, active, onClick, badge }) => {
  const Icon = item.icon;
  const glow = active
    ? '0 0 18px rgba(0,230,118,0.4)'
    : item.highlight
      ? '0 0 10px rgba(0,230,118,0.15)'
      : 'none';
  const bg = active
    ? 'rgba(0,230,118,0.14)'
    : item.highlight || item.accent
      ? 'rgba(0,230,118,0.05)'
      : 'rgba(255,255,255,0.03)';
  const border = active
    ? '1.5px solid rgba(0,230,118,0.55)'
    : item.highlight || item.accent
      ? '1px solid rgba(0,230,118,0.22)'
      : '1px solid rgba(255,255,255,0.06)';
  const color = active || item.highlight || item.accent ? '#00E676' : '#6b7280';

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative"
        style={{ background: bg, border, boxShadow: glow }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.boxShadow  = '0 0 14px rgba(0,230,118,0.15)';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = bg;
            e.currentTarget.style.boxShadow  = glow;
          }
        }}
      >
        <Icon style={{ width: 18, height: 18, color }} />
        {badge > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center"
            style={{ background: '#00E676', color: 'black' }}
          >
            {badge}
          </span>
        )}
      </button>
      {/* tooltip */}
      <div
        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
        style={{ whiteSpace: 'nowrap' }}
      >
        <div
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{
            background: 'rgba(10,11,14,0.97)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          }}
        >
          {item.label}
        </div>
        {/* arrow */}
        <div
          className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
          style={{ borderRightColor: 'rgba(10,11,14,0.97)', marginRight: -1 }}
        />
      </div>
    </div>
  );
};

export const CircularSidebar = ({
  currentView,
  setCurrentView,
  isOfflineMode,
  setIsOfflineMode,
  userPlaylists = [],
  onCreatePlaylistClick,
  onPlaylistClick,
  likedTrackCount = 0,
  downloadCount = 0,
  user,
}) => {
  return (
    <aside
      className="flex flex-col items-center py-4 gap-2 flex-shrink-0 z-20 h-full"
      style={{
        width: 80,
        background: 'rgba(7,8,10,0.97)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo / Brand circle */}
      <button
        onClick={() => setCurrentView('home')}
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-1 transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #00E676 0%, #00b850 100%)',
          boxShadow: '0 0 24px rgba(0,230,118,0.45)',
        }}
        title="OBSIDIAN"
      >
        <div
          className="w-5 h-5 bg-black flex items-center justify-center"
          style={{ borderRadius: 4, transform: 'rotate(45deg)' }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#00E676', transform: 'rotate(-45deg)' }}
          />
        </div>
      </button>

      {/* thin divider */}
      <div className="w-8 h-px my-0.5" style={{ background: 'rgba(255,255,255,0.07)' }} />

      {/* Primary nav items */}
      {NAV.map(item => (
        <NavBtn
          key={item.id}
          item={item}
          active={currentView === item.id}
          onClick={() => setCurrentView(item.id)}
          badge={item.id === 'downloaded' ? downloadCount : 0}
        />
      ))}

      {/* thin divider */}
      <div className="w-8 h-px my-0.5" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Playlist mini-circles */}
      <div className="flex flex-col items-center gap-1.5 flex-1 overflow-hidden w-full px-3">
        {/* Create playlist */}
        <button
          onClick={onCreatePlaylistClick}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.12)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.border = '1px dashed rgba(0,230,118,0.4)';
            e.currentTarget.style.background = 'rgba(0,230,118,0.06)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.border = '1px dashed rgba(255,255,255,0.12)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          }}
          title="Create Playlist"
        >
          <Plus style={{ width: 14, height: 14, color: '#6b7280' }} />
        </button>

        {/* Liked songs bubble */}
        <button
          onClick={() => setCurrentView('liked')}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: 'linear-gradient(135deg, #065f46, #022c22)',
            border: currentView === 'liked'
              ? '2px solid #00E676'
              : '2px solid rgba(255,255,255,0.08)',
            boxShadow: currentView === 'liked' ? '0 0 12px rgba(0,230,118,0.3)' : 'none',
          }}
          title={`Liked Songs (${likedTrackCount})`}
        >
          <Heart style={{ width: 13, height: 13, color: 'white', fill: 'white' }} />
        </button>

        {/* User playlist circles */}
        {userPlaylists.slice(0, 4).map(pl => {
          const active = currentView === `playlist-${pl.id}`;
          return (
            <button
              key={pl.id}
              onClick={() => onPlaylistClick(pl.id)}
              className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
              style={{
                border: active
                  ? '2px solid #00E676'
                  : '2px solid rgba(255,255,255,0.08)',
                boxShadow: active ? '0 0 12px rgba(0,230,118,0.3)' : 'none',
              }}
              title={pl.title}
            >
              {pl.coverUrl ? (
                <img src={pl.coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: '#14161A' }}
                >
                  <Music2 style={{ width: 12, height: 12, color: '#00E676' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-2 pt-2">
        {/* Offline toggle */}
        <button
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: isOfflineMode ? 'rgba(251,191,36,0.12)' : 'rgba(0,230,118,0.08)',
            border: isOfflineMode
              ? '1.5px solid rgba(251,191,36,0.4)'
              : '1.5px solid rgba(0,230,118,0.25)',
          }}
          title={isOfflineMode ? 'Switch to Online' : 'Switch to Offline'}
        >
          {isOfflineMode ? (
            <WifiOff style={{ width: 13, height: 13, color: '#fbbf24' }} />
          ) : (
            <Wifi    style={{ width: 13, height: 13, color: '#00E676' }} />
          )}
        </button>

        {/* User avatar */}
        <div
          className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer"
          style={{ border: '2px solid rgba(0,230,118,0.4)' }}
          title={user?.name || 'Kaelen Vance'}
        >
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="User"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              bottom: 0, right: 0,
              background: '#00E676',
              border: '2px solid #07080A',
            }}
          />
        </div>
      </div>
    </aside>
  );
};
