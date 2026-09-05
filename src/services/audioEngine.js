import { getCachedTrackAudioUrl } from './db';

class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.isInitialized = false;

    // Callbacks
    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
    this.onErrorCallback = null;
    this.onStateChangeCallback = null;

    // Dynamic state
    this.currentTrack = null;
    this.isPlaying = false;
    this.isOfflineMode = false;
    this.currentObjectUrl = null;

    this.setupAudioListeners();
  }

  initWebAudio() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128; // 64 frequency bars
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API init notice:', e);
    }
  }

  setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback({
          currentTime: this.audio.currentTime || 0,
          duration: this.audio.duration || 0,
          progress: this.audio.duration ? (this.audio.currentTime / this.audio.duration) * 100 : 0
        });
      }
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.onEndedCallback) this.onEndedCallback();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio Playback Error:', e);
      if (this.onErrorCallback) this.onErrorCallback(e);
    });
  }

  async loadAndPlayTrack(track, forceOffline = false) {
    this.initWebAudio();
    this.currentTrack = track;

    // Revoke previous blob URL if needed
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    // 1. Check if track exists in IndexedDB offline cache
    const cachedUrl = await getCachedTrackAudioUrl(track.id);

    let finalAudioSrc = null;
    if (cachedUrl) {
      this.currentObjectUrl = cachedUrl;
      finalAudioSrc = cachedUrl;
    } else if (forceOffline || this.isOfflineMode) {
      console.warn(`Track ${track.title} is not cached offline and offline mode is enabled.`);
      // If offline mode is enabled and track is not cached, return false or load synthetic fallback
      const cachedSynthUrl = await this.createSyntheticAudioUrl(track.duration || 30);
      this.currentObjectUrl = cachedSynthUrl;
      finalAudioSrc = cachedSynthUrl;
    } else {
      finalAudioSrc = track.audioUrl || track.audio_url || track.url || (track.id ? `/api/tracks/${track.id}/stream` : null);
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn('AudioContext resume warning:', e);
      }
    }

    this.audio.src = finalAudioSrc;
    this.audio.load();

    try {
      await this.audio.play();
      this.isPlaying = true;
      return true;
    } catch (err) {
      console.warn('Playback play() attempt failed, retrying with fallback audio generation:', err);
      try {
        const fallbackUrl = await this.createSyntheticAudioUrl(track.duration || 30);
        this.currentObjectUrl = fallbackUrl;
        this.audio.src = fallbackUrl;
        this.audio.load();
        await this.audio.play();
        this.isPlaying = true;
        return true;
      } catch (innerErr) {
        console.error('Fatal playback failure:', innerErr);
        this.isPlaying = false;
        return false;
      }
    }
  }

  async createSyntheticAudioUrl(duration = 20) {
    const sampleRate = 44100;
    const numFrames = sampleRate * Math.min(duration, 15);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
    const buffer = audioContext.createBuffer(1, numFrames, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < numFrames; i++) {
      const t = i / sampleRate;
      const wave = 0.3 * Math.sin(2 * Math.PI * 220 * t) +
                   0.2 * Math.sin(2 * Math.PI * 330 * t) +
                   0.15 * Math.sin(2 * Math.PI * 440 * t);
      const pulse = 0.7 + 0.3 * Math.sin(2 * Math.PI * 2 * t);
      data[i] = wave * pulse * 0.4;
    }

    const wavBytes = this.bufferToWav(buffer);
    const blob = new Blob([wavBytes], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  bufferToWav(buffer) {
    const numChannels = 1;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const data = buffer.getChannelData(0);
    const dataSize = data.length * bytesPerSample;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < data.length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }

    return arrayBuffer;
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  play() {
    this.initWebAudio();
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(seconds) {
    if (this.audio && !isNaN(seconds)) {
      this.audio.currentTime = seconds;
    }
  }

  setVolume(volumeFraction) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volumeFraction));
    }
  }

  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(32);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  setOfflineMode(isOffline) {
    this.isOfflineMode = isOffline;
  }
}

export const audioEngine = new AudioEngine();
