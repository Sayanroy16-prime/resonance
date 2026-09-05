import { MOCK_TRACKS, MOCK_PLAYLISTS, MOCK_ALBUMS, GENRES_LIST, GUITAR_TRACKS, GUITAR_CATEGORIES } from '../data/mockTracks';
import { 
  getLikedSongIds as getLocalLikedIds, 
  toggleLikedSongDB as toggleLocalLikedDB,
  getUserPlaylistsDB as getLocalPlaylists,
  saveUserPlaylistDB as saveLocalPlaylist,
  deleteUserPlaylistDB as deleteLocalPlaylist
} from './db';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('resonance_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // --- Authentication ---
  async login(identifier, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('resonance_token', data.token);
      }
      return data;
    } catch (err) {
      console.warn('Backend login unavailable, fallback to local:', err);
      return null;
    }
  },

  async guestLogin() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('resonance_token', data.token);
      }
      return data;
    } catch (err) {
      console.warn('Backend guest login unavailable, fallback to local:', err);
      return {
        success: true,
        user: {
          id: 'usr-guest',
          name: 'Guest Audiophile',
          email: 'guest@resonance.fm',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          provider: 'Local Guest'
        }
      };
    }
  },

  async sendPhoneOtp(phoneNumber) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/phone-otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      return await res.json();
    } catch {
      return { success: true, demoCode: '123456' };
    }
  },

  async verifyPhoneOtp(phoneNumber, code) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/phone-otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('resonance_token', data.token);
      }
      return data;
    } catch (err) {
      console.warn('Backend OTP verification unavailable, fallback to local mock:', err);
      return {
        success: true,
        user: {
          id: `usr-phone-${Date.now()}`,
          name: `Audio Enthusiast (${phoneNumber.slice(-4)})`,
          phone: phoneNumber,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          provider: 'Phone Verification'
        }
      };
    }
  },

  // --- Tracks & Streaming ---
  async getTracks(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/tracks?${query}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.tracks || MOCK_TRACKS;
    } catch (err) {
      console.warn('Backend tracks fetch failed, using fallback mock:', err);
      return MOCK_TRACKS;
    }
  },

  async getTrack(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/tracks/${id}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.track;
    } catch {
      return MOCK_TRACKS.find(t => t.id === id) || null;
    }
  },

  getAudioStreamUrl(track) {
    // If backend is live, stream via /api/tracks/:id/stream with HTTP 206 support
    if (track?.id) {
      return `${API_BASE_URL}/tracks/${track.id}/stream`;
    }
    return track?.audioUrl || track?.audio_url || null;
  },

  async scrobbleTrack(trackId, durationPlayed = 0) {
    try {
      await fetch(`${API_BASE_URL}/tracks/${trackId}/play`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ durationPlayed })
      });
    } catch {
      // Non-critical scrobble fallback
    }
  },

  // --- Playlists ---
  async getPlaylists() {
    try {
      const res = await fetch(`${API_BASE_URL}/playlists`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.playlists || MOCK_PLAYLISTS;
    } catch {
      return MOCK_PLAYLISTS;
    }
  },

  async getUserPlaylists() {
    try {
      const res = await fetch(`${API_BASE_URL}/me/playlists`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.playlists;
    } catch {
      return await getLocalPlaylists();
    }
  },

  async createPlaylist(playlist) {
    try {
      const res = await fetch(`${API_BASE_URL}/playlists`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(playlist)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Also cache in local IndexedDB
      await saveLocalPlaylist(data.playlist);
      return data.playlist;
    } catch {
      const fallbackRecord = {
        id: `custom-pl-${Date.now()}`,
        ...playlist,
        tracks: [],
        isCustom: true
      };
      await saveLocalPlaylist(fallbackRecord);
      return fallbackRecord;
    }
  },

  async deletePlaylist(id) {
    try {
      await fetch(`${API_BASE_URL}/playlists/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {
      // Continue to local delete
    }
    await deleteLocalPlaylist(id);
    return true;
  },

  // --- Liked Songs ---
  async getLikedTrackIds() {
    try {
      const res = await fetch(`${API_BASE_URL}/me/liked-ids`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.likedTrackIds;
    } catch {
      return await getLocalLikedIds();
    }
  },

  async toggleLikeTrack(trackId, currentlyLiked) {
    try {
      if (currentlyLiked) {
        await fetch(`${API_BASE_URL}/me/liked-songs/${trackId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      } else {
        await fetch(`${API_BASE_URL}/me/liked-songs/${trackId}`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
      }
    } catch {
      // Continue to local DB update
    }
    return await toggleLocalLikedDB(trackId);
  },

  // --- Search & Categories ---
  async search(query) {
    try {
      const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      const term = query.toLowerCase();
      const tracks = MOCK_TRACKS.filter(t => 
        t.title.toLowerCase().includes(term) || 
        t.artist.toLowerCase().includes(term) || 
        t.genre.toLowerCase().includes(term)
      );
      return { success: true, tracks, artists: [], albums: [], playlists: [] };
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/browse/categories`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.categories || GENRES_LIST;
    } catch {
      return GENRES_LIST;
    }
  },

  // --- Albums Catalog ---
  async getAlbums() {
    try {
      const res = await fetch(`${API_BASE_URL}/albums`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.albums && data.albums.length > 0 ? data.albums : MOCK_ALBUMS;
    } catch (err) {
      console.warn('Backend albums fetch failed, using fallback mock:', err);
      return MOCK_ALBUMS;
    }
  },

  async getAlbum(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/albums/${id}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.album;
    } catch {
      return MOCK_ALBUMS.find(a => a.id === id) || null;
    }
  },

  // --- Guitar Studio APIs ---
  async getGuitarTracks(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/guitar/tracks?${query}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.tracks && data.tracks.length > 0 ? data.tracks : GUITAR_TRACKS;
    } catch (err) {
      console.warn('Backend guitar tracks fetch failed, fallback to local:', err);
      return GUITAR_TRACKS;
    }
  },

  async getGuitarTrack(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/guitar/tracks/${id}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.track;
    } catch {
      return GUITAR_TRACKS.find(t => t.id === id) || null;
    }
  },

  async getGuitarCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/guitar/categories`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.categories || GUITAR_CATEGORIES;
    } catch {
      return GUITAR_CATEGORIES;
    }
  },

  async getGuitarTunings() {
    try {
      const res = await fetch(`${API_BASE_URL}/guitar/tunings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.tunings || [];
    } catch {
      return [];
    }
  },

  async getGuitarChords() {
    try {
      const res = await fetch(`${API_BASE_URL}/guitar/chords`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.chords || [];
    } catch {
      return [];
    }
  },

  async getGuitarTabs(id = null) {
    try {
      const url = id ? `${API_BASE_URL}/guitar/tabs/${id}` : `${API_BASE_URL}/guitar/tabs`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return id ? data.tab : data.tabs;
    } catch {
      return id ? null : [];
    }
  },

  async getGuitarPedals() {
    try {
      const res = await fetch(`${API_BASE_URL}/guitar/pedals`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.pedals || [];
    } catch {
      return [];
    }
  },

  async getGuitarPresets() {
    try {
      const res = await fetch(`${API_BASE_URL}/guitar/presets`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.presets || [];
    } catch {
      return [];
    }
  },

  async saveGuitarPreset(preset) {
    try {
      const res = await fetch(`${API_BASE_URL}/guitar/presets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(preset)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Failed to save preset to backend:', err);
      return { success: false };
    }
  }
};
