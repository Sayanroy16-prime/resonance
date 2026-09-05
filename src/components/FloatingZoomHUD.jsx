import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';

export const FloatingZoomHUD = ({
  zoomLevel,
  onSetZoom,
  onToggleZoom,
  hoverZoom,
  onToggleHoverZoom
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const zoomPercent = Math.round(zoomLevel * 100);

  return (
    <aside 
      aria-label="Zoom Controls"
      className="fixed bottom-28 right-6 z-40 select-none flex flex-col items-end gap-2"
    >
      {/* Expanded Controls Panel */}
      {isExpanded && (
        <div className="glass-zoom-hud p-3 rounded-2xl border border-white/10 flex flex-col gap-2.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 min-w-[200px]">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-[#00E676]" />
              Display Zoom
            </span>
            <span className="text-[10px] font-mono text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-full font-bold">
              {zoomPercent}%
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { val: 1.0, label: '100%' },
              { val: 1.15, label: '115%' },
              { val: 1.3, label: '130%' }
            ].map(preset => (
              <button
                key={preset.val}
                onClick={() => onSetZoom(preset.val)}
                className={`py-1 rounded-lg text-xs font-bold transition ${
                  zoomLevel === preset.val
                    ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
            <button
              onClick={() => onSetZoom(Math.max(0.85, Math.round((zoomLevel - 0.1) * 100) / 100))}
              disabled={zoomLevel <= 0.85}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-40 transition flex-1 flex items-center justify-center gap-1 text-xs font-semibold"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span>Out</span>
            </button>
            <button
              onClick={() => onSetZoom(1.0)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition text-[11px] font-bold"
              title="Reset Zoom to 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetZoom(Math.min(1.5, Math.round((zoomLevel + 0.1) * 100) / 100))}
              disabled={zoomLevel >= 1.5}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-40 transition flex-1 flex items-center justify-center gap-1 text-xs font-semibold"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>In</span>
            </button>
          </div>

          {/* Hover Zoom Lens Toggle */}
          <button
            onClick={onToggleHoverZoom}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              hoverZoom 
                ? 'bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676]' 
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3 h-3" />
              Hover Zoom Lens
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {hoverZoom ? 'ON' : 'OFF'}
            </span>
          </button>

          <p className="text-[9px] text-gray-400 text-center font-mono pt-1">
            Tip: Press <kbd className="px-1 py-0.5 bg-black/40 rounded border border-white/10 text-[#00E676]">Z</kbd> to toggle zoom
          </p>
        </div>
      )}

      {/* Main Collapsible Zoom Pill Button */}
      <div className="flex items-center gap-1 bg-[#12141a]/95 border border-white/15 rounded-full shadow-2xl p-1 backdrop-blur-xl">
        <button
          onClick={onToggleZoom}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
            zoomLevel > 1 
              ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/40 scale-105' 
              : 'bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white'
          }`}
          title="Toggle Zoom Mode (Press Z)"
        >
          {zoomLevel > 1 ? (
            <ZoomOut className="w-3.5 h-3.5" />
          ) : (
            <ZoomIn className="w-3.5 h-3.5 text-[#00E676]" />
          )}
          <span>{zoomPercent}%</span>
          {hoverZoom && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-ping" title="Hover Zoom Lens Enabled" />
          )}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          title={isExpanded ? "Collapse Zoom Controls" : "Expand Zoom Controls"}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
};
