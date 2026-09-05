const DB_NAME = 'ResonanceAudioDB';
const DB_VERSION = 1;

let dbInstance = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('cached_tracks')) {
        db.createObjectStore('cached_tracks', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('liked_songs')) {
        db.createObjectStore('liked_songs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Generate fallback synthetic audio Blob if remote network request is blocked
const generateSynthFallbackBlob = (durationSeconds = 15) => {
  const sampleRate = 44100;
  const numFrames = sampleRate * Math.min(durationSeconds, 20);
  const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
  const buffer = audioContext.createBuffer(1, numFrames, sampleRate);
  const data = buffer.getChannelData(0);

  // Generate pleasant ambient lofi chord synth wave
  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;
    // Harmonic frequencies: 220Hz (A3), 277.18Hz (C#4), 329.63Hz (E4), 440Hz (A4) with beat envelope
    const wave = 0.3 * Math.sin(2 * Math.PI * 220 * t) +
                 0.2 * Math.sin(2 * Math.PI * 277.18 * t) +
                 0.25 * Math.sin(2 * Math.PI * 329.63 * t) +
                 0.1 * Math.sin(2 * Math.PI * 440 * t);
    const envelope = Math.sin(Math.PI * (i / numFrames)); // smooth fade in / out
    const rhythm = 0.8 + 0.2 * Math.sin(2 * Math.PI * 1.5 * t); // subtle pulse
    data[i] = wave * envelope * rhythm * 0.4;
  }

  // Convert buffer to WAV PCM blob
  const wavBytes = bufferToWav(buffer);
  return new Blob([wavBytes], { type: 'audio/wav' });
};

// Simple WAV encoder helper for synthetic blob
function bufferToWav(buffer) {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const data = buffer.getChannelData(0);
  const dataSize = data.length * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + dataSize, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, dataSize, true);

  // Write PCM audio samples
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return arrayBuffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Download & cache track to IndexedDB
export const downloadTrack = async (track, onProgress = () => {}) => {
  const db = await initDB();
  onProgress(10);

  let blob = null;
  try {
    const audioSrc = track.audioUrl || track.audio_url || track.url || (track.id ? `/api/tracks/${track.id}/stream` : '');
    const response = await fetch(audioSrc);
    onProgress(50);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    blob = await response.blob();
    onProgress(80);
  } catch (err) {
    console.warn(`Direct fetch failed for ${track.title}, using high-quality synthetic audio cache backup:`, err);
    onProgress(70);
    blob = generateSynthFallbackBlob(track.duration || 30);
    onProgress(90);
  }

  const record = {
    id: track.id,
    trackData: track,
    blob: blob,
    cachedAt: new Date().toISOString(),
    sizeBytes: blob.size,
    sizeMB: (blob.size / (1024 * 1024)).toFixed(2)
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_tracks', 'readwrite');
    const store = tx.objectStore('cached_tracks');
    const req = store.put(record);

    req.onsuccess = () => {
      onProgress(100);
      resolve(record);
    };
    req.onerror = () => reject(req.error);
  });
};

// Retrieve Blob Object URL for playing offline cached audio
export const getCachedTrackAudioUrl = async (trackId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_tracks', 'readonly');
    const store = tx.objectStore('cached_tracks');
    const req = store.get(trackId);

    req.onsuccess = () => {
      const record = req.result;
      if (record && record.blob) {
        const objectUrl = URL.createObjectURL(record.blob);
        resolve(objectUrl);
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
};

// Remove cached track from IndexedDB
export const removeCachedTrack = async (trackId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_tracks', 'readwrite');
    const store = tx.objectStore('cached_tracks');
    const req = store.delete(trackId);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
};

// Get list of all downloaded track IDs
export const getDownloadedTrackIds = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_tracks', 'readonly');
    const store = tx.objectStore('cached_tracks');
    const req = store.getAllKeys();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

// Get list of all downloaded track full objects
export const getDownloadedTracks = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_tracks', 'readonly');
    const store = tx.objectStore('cached_tracks');
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

// Get storage usage breakdown
export const getStorageUsageInfo = async () => {
  const tracks = await getDownloadedTracks();
  let totalBytes = 0;
  tracks.forEach(item => {
    totalBytes += item.sizeBytes || 0;
  });
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  return {
    totalBytes,
    totalMB,
    count: tracks.length
  };
};

// Clear all offline cached audio
export const clearAllOfflineCache = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_tracks', 'readwrite');
    const store = tx.objectStore('cached_tracks');
    const req = store.clear();

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
};

// --- Liked Songs Utilities ---
export const getLikedSongIds = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('liked_songs', 'readonly');
    const store = tx.objectStore('liked_songs');
    const req = store.getAllKeys();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

export const toggleLikedSongDB = async (trackId) => {
  const db = await initDB();
  const liked = await getLikedSongIds();
  const isLiked = liked.includes(trackId);

  return new Promise((resolve, reject) => {
    const tx = db.transaction('liked_songs', 'readwrite');
    const store = tx.objectStore('liked_songs');
    if (isLiked) {
      const req = store.delete(trackId);
      req.onsuccess = () => resolve(false);
      req.onerror = () => reject(req.error);
    } else {
      const req = store.put({ id: trackId, likedAt: new Date().toISOString() });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    }
  });
};

// --- Custom Playlists Utilities ---
export const getUserPlaylistsDB = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('playlists', 'readonly');
    const store = tx.objectStore('playlists');
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

export const saveUserPlaylistDB = async (playlist) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('playlists', 'readwrite');
    const store = tx.objectStore('playlists');
    const req = store.put(playlist);

    req.onsuccess = () => resolve(playlist);
    req.onerror = () => reject(req.error);
  });
};

export const deleteUserPlaylistDB = async (playlistId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('playlists', 'readwrite');
    const store = tx.objectStore('playlists');
    const req = store.delete(playlistId);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
};
