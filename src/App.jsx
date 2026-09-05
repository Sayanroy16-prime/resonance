import React, { useState, useEffect } from 'react';
import { CircularSidebar } from './components/CircularSidebar';
import { Navbar } from './components/Navbar';
import { PlayerBar } from './components/PlayerBar';
import { QueueDrawer } from './components/QueueDrawer';
import { FullPlayerOverlay } from './components/FullPlayerOverlay';
import { AuthScreen } from './components/AuthScreen';
import { FloatingZoomHUD } from './components/FloatingZoomHUD';

import { CircularHomeView } from './views/CircularHomeView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { DownloadedView } from './views/DownloadedView';
import { DetailView } from './views/DetailView';
import { PreviewView } from './views/PreviewView';
import { GuitarView } from './views/GuitarView';

import { MOCK_TRACKS, MOCK_ALBUMS, MOCK_PLAYLISTS } from './data/mockTracks';
import { audioEngine } from './services/audioEngine';
import { api } from './services/api';
import { 
  downloadTrack, 
  getDownloadedTrackIds, 
  getLikedSongIds, 
  toggleLikedSongDB, 
  getUserPlaylistsDB, 
  saveUserPlaylistDB, 
  deleteUserPlaylistDB 
} from './services/db';

export function App() {
  // Auth State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('resonance_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Navigation & Views
  const [currentView, setCurrentView] = useState('home');
  const [detailData, setDetailData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewHistory, setViewHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Catalog & Data State
  const [tracks, setTracks] = useState(MOCK_TRACKS);
  const [albums, setAlbums] = useState(MOCK_ALBUMS);

  // Playback & Queue State
  const [currentTrack, setCurrentTrack] = useState(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([MOCK_TRACKS[1], MOCK_TRACKS[2], MOCK_TRACKS[3]]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // Time & Volume
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Storage & Offline Engine
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [downloadedTrackIds, setDownloadedTrackIds] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [likedTrackIds, setLikedTrackIds] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);

  // Modals & Panels
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  // Global Zoom & Magnifier State
  const [globalZoom, setGlobalZoom] = useState(1.0); // 1.0, 1.15, 1.3
  const [hoverZoom, setHoverZoom] = useState(true);

  const handleToggleZoom = () => {
    setGlobalZoom(z => (z === 1.0 ? 1.15 : z === 1.15 ? 1.3 : 1.0));
  };

  const handleToggleHoverZoom = () => {
    setHoverZoom(prev => !prev);
  };

  // Keyboard shortcut listener: 'Z' toggles zoom, 'Escape' resets zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleToggleZoom();
      } else if (e.key === 'Escape' && globalZoom > 1) {
        setGlobalZoom(1.0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalZoom]);

  // Sync DB records & Backend data on startup / user change
  useEffect(() => {
    const syncDBData = async () => {
      try {
        const downloaded = await getDownloadedTrackIds();
        setDownloadedTrackIds(downloaded);

        const liked = await api.getLikedTrackIds();
        setLikedTrackIds(liked);

        const playlists = await api.getUserPlaylists();
        setUserPlaylists(playlists);

        const liveTracks = await api.getTracks();
        if (liveTracks && liveTracks.length > 0) {
          setTracks(liveTracks);
        }

        const liveAlbums = await api.getAlbums();
        if (liveAlbums && liveAlbums.length > 0) {
          setAlbums(liveAlbums);
        }
      } catch (e) {
        console.error('Error syncing DB data:', e);
      }
    };
    syncDBData();
  }, [user]);

  // Connect Audio Engine listeners
  useEffect(() => {
    audioEngine.onTimeUpdateCallback = ({ currentTime, duration }) => {
      setCurrentTime(currentTime);
      setDuration(duration);
    };

    audioEngine.onStateChangeCallback = (playingState) => {
      setIsPlaying(playingState);
    };

    audioEngine.onEndedCallback = () => {
      handleTrackEnded();
    };
  }, [queue, repeatMode, isShuffle, currentTrack]);

  // Network Offline Mode Simulator Effect
  useEffect(() => {
    audioEngine.setOfflineMode(isOfflineMode);
  }, [isOfflineMode]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('resonance_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('resonance_user');
    audioEngine.pause();
  };

  // Track Playback Trigger
  const handlePlayTrack = async (track) => {
    setCurrentTrack(track);
    api.scrobbleTrack(track.id);
    await audioEngine.loadAndPlayTrack(track, isOfflineMode);
  };

  const handleTogglePlay = () => {
    if (!currentTrack) {
      if (tracks.length > 0) handlePlayTrack(tracks[0]);
      return;
    }
    audioEngine.togglePlayPause();
  };

  const handleTrackEnded = () => {
    if (repeatMode === 'one' && currentTrack) {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(queue.slice(1));
      handlePlayTrack(nextTrack);
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      handlePlayTrack(tracks[randomIndex]);
    } else {
      const currIdx = tracks.findIndex(t => t.id === currentTrack?.id);
      const nextIdx = (currIdx + 1) % tracks.length;
      handlePlayTrack(tracks[nextIdx]);
    }
  };

  const handleSkipNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(queue.slice(1));
      handlePlayTrack(nextTrack);
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      handlePlayTrack(tracks[randomIndex]);
    } else if (currentTrack) {
      const currIdx = tracks.findIndex(t => t.id === currentTrack.id);
      const nextIdx = (currIdx + 1) % tracks.length;
      handlePlayTrack(tracks[nextIdx]);
    }
  };

  const handleSkipPrev = () => {
    if (currentTime > 4) {
      audioEngine.seek(0);
    } else if (currentTrack) {
      const currIdx = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIdx = (currIdx - 1 + tracks.length) % tracks.length;
      handlePlayTrack(tracks[prevIdx]);
    }
  };

  // Like Toggle
  const handleToggleLikeTrack = async (trackId) => {
    const isCurrentlyLiked = likedTrackIds.includes(trackId);
    await api.toggleLikeTrack(trackId, isCurrentlyLiked);
    if (!isCurrentlyLiked) {
      setLikedTrackIds([...likedTrackIds, trackId]);
    } else {
      setLikedTrackIds(likedTrackIds.filter(id => id !== trackId));
    }
  };

  // Download Toggle (IndexedDB Caching)
  const handleDownloadTrack = async (track) => {
    setDownloadProgress(10);
    try {
      await downloadTrack(track, (prog) => setDownloadProgress(prog));
      const downloaded = await getDownloadedTrackIds();
      setDownloadedTrackIds(downloaded);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setDownloadProgress(0), 1000);
    }
  };

  const handleDownloadAll = async (tracks) => {
    for (const track of tracks) {
      await handleDownloadTrack(track);
    }
  };

  // Add to Queue
  const handleAddToQueue = (track) => {
    setQueue([...queue, track]);
  };

  // Navigation History
  const navigateTo = (view, detail = null) => {
    setCurrentView(view);
    if (detail) setDetailData(detail);
    const newHistory = viewHistory.slice(0, historyIndex + 1);
    newHistory.push(view);
    setViewHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setCurrentView(viewHistory[newIdx]);
    }
  };

  const handleForward = () => {
    if (historyIndex < viewHistory.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setCurrentView(viewHistory[newIdx]);
    }
  };

  // Select Album / Playlist
  const handleSelectAlbum = (album) => {
    navigateTo(`album-${album.id}`, {
      type: 'ALBUM',
      title: album.title,
      description: album.description,
      coverUrl: album.coverUrl,
      author: album.artist,
      tracks: album.tracks
    });
  };

  const handleSelectPlaylist = (playlistId) => {
    const pl = [...MOCK_PLAYLISTS, ...userPlaylists].find(p => p.id === playlistId);
    if (pl) {
      navigateTo(`playlist-${pl.id}`, {
        type: 'PLAYLIST',
        title: pl.title,
        description: pl.description,
        coverUrl: pl.coverUrl,
        author: pl.author || 'User',
        tracks: pl.tracks || []
      });
    }
  };

  const handleSelectLiked = () => {
    const likedTracks = tracks.filter(t => likedTrackIds.includes(t.id));
    navigateTo('liked', {
      type: 'FAVORITES',
      title: 'Liked Songs',
      description: 'Your collection of favorited synthwave and lofi tracks.',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      author: 'User Collection',
      tracks: likedTracks
    });
  };

  // Custom Playlist Handlers
  const handleCreatePlaylist = async (newPl) => {
    const playlistRecord = {
      title: newPl.title,
      description: newPl.description,
      coverUrl: newPl.coverUrl,
      author: user?.name || 'User'
    };
    await api.createPlaylist(playlistRecord);
    const updated = await api.getUserPlaylists();
    setUserPlaylists(updated);
  };

  const handleDeletePlaylist = async (playlistId) => {
    await api.deletePlaylist(playlistId);
    const updated = await api.getUserPlaylists();
    setUserPlaylists(updated);
    if (currentView === `playlist-${playlistId}`) navigateTo('library');
  };

  // Render Auth Portal if not logged in
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[#1A0507] text-white ${hoverZoom ? 'hover-zoom-enabled' : ''}`}>
      {/* Circular Sidebar */}
      <CircularSidebar
        currentView={currentView}
        setCurrentView={(view) => navigateTo(view)}
        isOfflineMode={isOfflineMode}
        setIsOfflineMode={setIsOfflineMode}
        userPlaylists={userPlaylists}
        onCreatePlaylistClick={() => navigateTo('library')}
        onPlaylistClick={handleSelectPlaylist}
        likedTrackCount={likedTrackIds.length}
        downloadCount={downloadedTrackIds.length}
        user={user}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Navbar */}
        <Navbar
          currentView={currentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isOfflineMode={isOfflineMode}
          onBack={handleBack}
          onForward={handleForward}
          user={user}
          onLogout={handleLogout}
          zoomLevel={globalZoom}
          onToggleZoom={handleToggleZoom}
          hoverZoom={hoverZoom}
          onToggleHoverZoom={handleToggleHoverZoom}
        />

        {/* Dynamic Route View Renderer with Zoom Scale Transition */}
        <main 
          className={`flex-1 relative zoom-smooth-transition ${currentView === 'home' ? 'overflow-hidden' : 'overflow-y-auto'}`}
          style={{
            transform: globalZoom !== 1.0 ? `scale(${globalZoom})` : undefined,
            transformOrigin: 'center top'
          }}
        >
          {currentView === 'home' && (
            <CircularHomeView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onTogglePlay={handleTogglePlay}
              onSkipNext={handleSkipNext}
              onSkipPrev={handleSkipPrev}
              isShuffle={isShuffle}
              onToggleShuffle={() => setIsShuffle(!isShuffle)}
              repeatMode={repeatMode}
              onToggleRepeat={() => {
                if (repeatMode === 'off') setRepeatMode('all');
                else if (repeatMode === 'all') setRepeatMode('one');
                else setRepeatMode('off');
              }}
              downloadedTrackIds={downloadedTrackIds}
              onDownloadTrack={handleDownloadTrack}
              likedTrackIds={likedTrackIds}
              onToggleLikeTrack={handleToggleLikeTrack}
              onAddToQueue={handleAddToQueue}
              currentTime={currentTime}
              duration={duration}
              onSeek={(seconds) => audioEngine.seek(seconds)}
              volume={volume}
              onVolumeChange={(val) => {
                setVolume(val);
                audioEngine.setVolume(val);
                setIsMuted(val === 0);
              }}
              isMuted={isMuted}
              onToggleMute={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                audioEngine.setVolume(nextMute ? 0 : volume);
              }}
              tracks={tracks.filter((t) => likedTrackIds.includes(t.id))}
            />
          )}

          {currentView === 'search' && (
            <SearchView
              tracks={tracks}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onTogglePlay={handleTogglePlay}
              downloadedTrackIds={downloadedTrackIds}
              onDownloadTrack={handleDownloadTrack}
              likedTrackIds={likedTrackIds}
              onToggleLikeTrack={handleToggleLikeTrack}
              onAddToQueue={handleAddToQueue}
            />
          )}

          {currentView === 'library' && (
            <LibraryView
              tracks={tracks}
              userPlaylists={userPlaylists}
              onCreatePlaylist={handleCreatePlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              onSelectPlaylist={handleSelectPlaylist}
              onSelectLiked={handleSelectLiked}
              onSelectDownloaded={() => navigateTo('downloaded')}
              likedTrackIds={likedTrackIds}
              downloadedTrackIds={downloadedTrackIds}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onTogglePlay={handleTogglePlay}
              onToggleLikeTrack={handleToggleLikeTrack}
              onDownloadTrack={handleDownloadTrack}
              onAddToQueue={handleAddToQueue}
            />
          )}

          {currentView === 'downloaded' && (
            <DownloadedView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onTogglePlay={handleTogglePlay}
              onCacheUpdated={async () => {
                const downloaded = await getDownloadedTrackIds();
                setDownloadedTrackIds(downloaded);
              }}
              isOfflineMode={isOfflineMode}
            />
          )}

          {currentView === 'guitar' && (
            <GuitarView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onTogglePlay={handleTogglePlay}
              likedTrackIds={likedTrackIds}
              onToggleLikeTrack={handleToggleLikeTrack}
              downloadedTrackIds={downloadedTrackIds}
              onDownloadTrack={handleDownloadTrack}
              onAddToQueue={handleAddToQueue}
            />
          )}

          {currentView === 'preview' && (
            <PreviewView
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              isOfflineMode={isOfflineMode}
              user={user}
            />
          )}

          {(currentView.startsWith('album-') || currentView.startsWith('playlist-') || currentView === 'liked') && (
            <DetailView
              detailData={detailData}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onTogglePlay={handleTogglePlay}
              onPlayAll={(tracks) => {
                if (tracks.length > 0) {
                  handlePlayTrack(tracks[0]);
                  setQueue(tracks.slice(1));
                }
              }}
              onShuffleAll={(tracks) => {
                const shuffled = [...tracks].sort(() => Math.random() - 0.5);
                if (shuffled.length > 0) {
                  handlePlayTrack(shuffled[0]);
                  setQueue(shuffled.slice(1));
                }
              }}
              downloadedTrackIds={downloadedTrackIds}
              onDownloadTrack={handleDownloadTrack}
              onDownloadAll={handleDownloadAll}
              likedTrackIds={likedTrackIds}
              onToggleLikeTrack={handleToggleLikeTrack}
              onAddToQueue={handleAddToQueue}
            />
          )}
        </main>

        {/* Persistent Bottom Player Bar */}
        <PlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onSkipNext={handleSkipNext}
          onSkipPrev={handleSkipPrev}
          isShuffle={isShuffle}
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          repeatMode={repeatMode}
          onToggleRepeat={() => {
            if (repeatMode === 'off') setRepeatMode('all');
            else if (repeatMode === 'all') setRepeatMode('one');
            else setRepeatMode('off');
          }}
          isLiked={currentTrack ? likedTrackIds.includes(currentTrack.id) : false}
          onToggleLike={() => currentTrack && handleToggleLikeTrack(currentTrack.id)}
          isDownloaded={currentTrack ? downloadedTrackIds.includes(currentTrack.id) : false}
          onToggleDownload={() => currentTrack && handleDownloadTrack(currentTrack)}
          downloadProgress={downloadProgress}
          currentTime={currentTime}
          duration={duration}
          onSeek={(seconds) => audioEngine.seek(seconds)}
          volume={volume}
          onVolumeChange={(val) => {
            setVolume(val);
            audioEngine.setVolume(val);
            setIsMuted(val === 0);
          }}
          isMuted={isMuted}
          onToggleMute={() => {
            const nextMute = !isMuted;
            setIsMuted(nextMute);
            audioEngine.setVolume(nextMute ? 0 : volume);
          }}
          onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
          queueCount={queue.length}
          onExpandPlayer={() => setIsFullPlayerOpen(true)}
        />
      </div>

      {/* Slide-out Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        currentTrack={currentTrack}
        queue={queue}
        setQueue={setQueue}
        onPlayTrack={handlePlayTrack}
        downloadedTrackIds={downloadedTrackIds}
      />

      {/* Fullscreen Expanded Player Overlay */}
      <FullPlayerOverlay
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSkipNext={handleSkipNext}
        onSkipPrev={handleSkipPrev}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        repeatMode={repeatMode}
        onToggleRepeat={() => {
          if (repeatMode === 'off') setRepeatMode('all');
          else if (repeatMode === 'all') setRepeatMode('one');
          else setRepeatMode('off');
        }}
        isLiked={currentTrack ? likedTrackIds.includes(currentTrack.id) : false}
        onToggleLike={() => currentTrack && handleToggleLikeTrack(currentTrack.id)}
        isDownloaded={currentTrack ? downloadedTrackIds.includes(currentTrack.id) : false}
        onToggleDownload={() => currentTrack && handleDownloadTrack(currentTrack)}
        currentTime={currentTime}
        duration={duration}
        onSeek={(seconds) => audioEngine.seek(seconds)}
        volume={volume}
        onVolumeChange={(val) => {
          setVolume(val);
          audioEngine.setVolume(val);
          setIsMuted(val === 0);
        }}
      />

      {/* Floating Zoom & Accessibility HUD */}
      <FloatingZoomHUD
        zoomLevel={globalZoom}
        onSetZoom={setGlobalZoom}
        onToggleZoom={handleToggleZoom}
        hoverZoom={hoverZoom}
        onToggleHoverZoom={handleToggleHoverZoom}
      />
    </div>
  );
}

export default App;
