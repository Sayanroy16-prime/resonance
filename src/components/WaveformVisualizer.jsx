import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../services/audioEngine';
import { Sparkles, Palette } from 'lucide-react';

export const WaveformVisualizer = ({ isPlaying }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const [theme, setTheme] = useState('green'); // 'green' | 'indigo' | 'rainbow'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const freqData = audioEngine.getFrequencyData();
      const numBars = 32;
      const barWidth = (width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        // Map frequency data smoothly
        const val = isPlaying ? (freqData[i] || Math.sin(Date.now() / 200 + i) * 20 + 20) : (Math.sin(Date.now() / 400 + i) * 6 + 10);
        const percent = Math.min(1, val / 255);
        const barHeight = Math.max(4, percent * height * 0.85);

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Dynamic gradients
        let gradient;
        if (theme === 'indigo') {
          gradient = ctx.createLinearGradient(0, height, 0, y);
          gradient.addColorStop(0, '#6366F1');
          gradient.addColorStop(1, '#A855F7');
        } else if (theme === 'rainbow') {
          gradient = ctx.createLinearGradient(0, height, 0, y);
          gradient.addColorStop(0, '#1DB954');
          gradient.addColorStop(0.5, '#3B82F6');
          gradient.addColorStop(1, '#EC4899');
        } else {
          gradient = ctx.createLinearGradient(0, height, 0, y);
          gradient.addColorStop(0, '#10B981');
          gradient.addColorStop(1, '#1DB954');
        }

        ctx.fillStyle = gradient;
        ctx.shadowBlur = isPlaying ? 8 : 2;
        ctx.shadowColor = theme === 'indigo' ? '#6366F1' : '#1DB954';

        // Draw rounded top bar
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, theme]);

  const toggleTheme = () => {
    if (theme === 'green') setTheme('indigo');
    else if (theme === 'indigo') setTheme('rainbow');
    else setTheme('green');
  };

  return (
    <div className="flex items-center gap-3 bg-[#0B0B0E]/80 border border-white/10 px-3 py-1.5 rounded-xl shadow-inner">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Sparkles className="w-3.5 h-3.5 text-[#1DB954]" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">Waveform</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={140} 
        height={32} 
        className="rounded cursor-pointer"
        onClick={toggleTheme}
        title="Click to change visualizer theme"
      />

      <button 
        onClick={toggleTheme}
        className="p-1 rounded text-gray-400 hover:text-white transition"
        title="Switch Visualizer Color Palette"
      >
        <Palette className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
